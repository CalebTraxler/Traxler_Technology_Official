

# Backend:
# cd C:\Users\caleb\source\repos\life_ai\life_ai\backend
# uvicorn main:app --reload --port 9000

# Frontend: 
# cd C:\Users\caleb\source\repos\life_ai\life_ai
# npm run dev

from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, status, Cookie
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import base64
import os
import requests
import json
from typing import Optional, Dict, List
import io
from groq import Groq
import logging
import time
import uvicorn
from pydantic import BaseModel
import uuid
from langchain.memory import ConversationBufferMemory
from langchain.schema import messages_from_dict, messages_to_dict
import asyncio
from starlette.responses import Response

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("traxler-vision-api")

# Initialize FastAPI app
app = FastAPI(
    title="Traxler Technology Vision API",
    description="Enterprise-grade image analysis platform powered by Llama 4 Scout 17B Vision model with memory.",
    version="1.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq API setup
GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # Get from environment or set your key here

# Initialize Groq client
try:
    groq_client = Groq(api_key=GROQ_API_KEY)
    logger.info("✓ Groq client initialized successfully")
except Exception as e:
    logger.error(f"✕ Failed to initialize Groq client: {str(e)}")
    groq_client = None

# Session and memory management
SESSION_EXPIRY_SECONDS = 3600  # 1 hour session timeout
conversation_memories: Dict[str, ConversationBufferMemory] = {}
session_timestamps: Dict[str, float] = {}

# Clean up expired sessions
async def cleanup_expired_sessions():
    while True:
        try:
            current_time = time.time()
            expired_sessions = [
                session_id for session_id, timestamp in session_timestamps.items()
                if current_time - timestamp > SESSION_EXPIRY_SECONDS
            ]
            
            for session_id in expired_sessions:
                if session_id in conversation_memories:
                    logger.info(f"Cleaning up expired session: {session_id}")
                    del conversation_memories[session_id]
                if session_id in session_timestamps:
                    del session_timestamps[session_id]
            
            await asyncio.sleep(300)  # Check every 5 minutes
        except Exception as e:
            logger.error(f"Error in session cleanup: {str(e)}")
            await asyncio.sleep(300)

# Start the cleanup task
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(cleanup_expired_sessions())

# Health check model
class HealthResponse(BaseModel):
    status: str
    message: str
    version: str

# Memory Stats Model
class MemoryStats(BaseModel):
    message_count: int
    characters: int
    tokens_estimate: int

# Memory Response Model
class MemoryResponse(BaseModel):
    session_id: str
    stats: MemoryStats
    status: str

# Analysis Response Model
class AnalysisResponse(BaseModel):
    analysis: str
    session_id: str
    memory_stats: Optional[MemoryStats] = None

# Root endpoint for health check
@app.get("/", response_model=HealthResponse)
async def root():
    return {
        "status": "online",
        "message": "Traxler Vision API is operational with memory management",
        "version": "1.1.0"
    }

# Define a dependency for extracting and validating the question
def get_question(question: Optional[str] = Form(None)) -> Optional[str]:
    """Extract and validate the question from form data"""
    if question is None:
        return None
    
    # Strip whitespace and check if it's empty
    question = question.strip()
    if not question:
        return None
        
    return question

# Get or create a session ID
def get_session_id(session_id: Optional[str] = Cookie(None)) -> str:
    if not session_id:
        session_id = str(uuid.uuid4())
    
    # Update session timestamp
    session_timestamps[session_id] = time.time()
    
    # Initialize conversation memory if needed
    if session_id not in conversation_memories:
        conversation_memories[session_id] = ConversationBufferMemory(return_messages=True)
    
    return session_id

# Calculate memory statistics
def get_memory_stats(session_id: str) -> MemoryStats:
    if session_id not in conversation_memories:
        return MemoryStats(message_count=0, characters=0, tokens_estimate=0)
    
    memory = conversation_memories[session_id]
    messages = memory.chat_memory.messages
    
    char_count = sum(len(msg.content) for msg in messages)
    # Rough token estimate (avg 4 chars per token)
    token_estimate = char_count // 4
    
    return MemoryStats(
        message_count=len(messages),
        characters=char_count,
        tokens_estimate=token_estimate
    )

# No model selection function - using only Llama 4 Scout model
MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"

# Get session memory endpoint
@app.get("/api/memory", response_model=MemoryResponse)
async def get_memory(session_id: str = Depends(get_session_id)):
    stats = get_memory_stats(session_id)
    return MemoryResponse(
        session_id=session_id,
        stats=stats,
        status="active"
    )

# Clear memory endpoint
@app.delete("/api/memory", response_model=MemoryResponse)
async def clear_memory(session_id: str = Depends(get_session_id)):
    if session_id in conversation_memories:
        conversation_memories[session_id] = ConversationBufferMemory(return_messages=True)
        logger.info(f"Memory cleared for session: {session_id}")
    
    stats = get_memory_stats(session_id)
    return MemoryResponse(
        session_id=session_id,
        stats=stats,
        status="cleared"
    )

# Combined analyze/question endpoint with Llama 4 Vision integration via Groq
@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_image(
    file: UploadFile = File(...),
    question: Optional[str] = Depends(get_question),  # Use dependency for question extraction
    session_id: str = Depends(get_session_id),
    response: Response = None
):
    request_id = f"req_{int(time.time())}"
    logger.info(f"[{request_id}] Processing new request with Llama 4 Scout model | Question: '{question or 'None'}' | Session: {session_id}")
    
    # Set session cookie
    if response:
        response.set_cookie(key="session_id", value=session_id, max_age=SESSION_EXPIRY_SECONDS, httponly=True)
    
    try:
        # Read the uploaded image
        img_bytes = await file.read()
        img_size_kb = len(img_bytes) / 1024
        logger.info(f"[{request_id}] Image received | Name: {file.filename} | Size: {img_size_kb:.2f}KB")
        
        # Encode for API
        img_base64 = base64.b64encode(img_bytes).decode()
        
        # Create data URL for image
        frame_data = f"data:image/jpeg;base64,{img_base64}"
        
        # Get conversation history from memory
        memory = conversation_memories.get(session_id)
        memory_context = ""
        
        if memory and memory.chat_memory.messages:
            # Extract last 5 messages for context
            recent_messages = memory.chat_memory.messages[-5:]
            memory_context = "\nRecent conversation history:\n"
            for msg in recent_messages:
                memory_context += f"{msg.type}: {msg.content}\n"
        
        # Prepare the prompt based on whether a question was asked
        if question is not None:
            # For the Ask button with a specific question
            logger.info(f"[{request_id}] QUESTION MODE: '{question}'")
            user_prompt = f"Question about this image: {question}\nPlease respond concisely but completely.{memory_context}"
            
            # Add the user question to memory
            if memory:
                memory.chat_memory.add_user_message(question)
        else:
            # For the Analyze Image button without a specific question
            logger.info(f"[{request_id}] ANALYSIS MODE (general description)")
            user_prompt = f"Describe what you see in this image in a concise, professional manner.{memory_context}"
        
        if not groq_client:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Vision service is currently unavailable. Please try again later."
            )
        
        logger.info(f"[{request_id}] Sending request to Groq API with Llama 4 Scout model")
        
        start_time = time.time()
        try:
            # Create the messages array with text and image
            chat_completion = groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": user_prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": frame_data,
                                },
                            },
                        ],
                    }
                ],
                model=MODEL,  # Use the Llama 4 Scout model
                max_tokens=100 if question is None else 75,  # Increased token limits
                temperature=0.7 if question is None else 0.2,  # Adjusted temperature
            )
            
            # Extract the response text
            analysis = chat_completion.choices[0].message.content.strip()
            processing_time = time.time() - start_time
            logger.info(f"[{request_id}] Groq API response received | Time: {processing_time:.2f}s")
            
            # Add the AI response to memory
            if memory:
                memory.chat_memory.add_ai_message(analysis)
            
        except Exception as groq_error:
            logger.error(f"[{request_id}] Groq API error: {str(groq_error)}")
            
            # Return proper error response
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Error communicating with vision service: " + str(groq_error)
            )
        
        logger.info(f"[{request_id}] Analysis complete | Response: '{analysis}'")
        
        # Get memory stats
        memory_stats = get_memory_stats(session_id)
        
        # Return analysis with session ID and memory stats
        return {
            "analysis": analysis,
            "session_id": session_id,
            "memory_stats": memory_stats
        }
    
    except HTTPException as http_ex:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"[{request_id}] Unhandled exception: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )

# Error handling middleware
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "analysis": "Failed to analyze image"},
    )

# Mount static files for production deployment (uncomment when ready)
# app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    # Run the application with uvicorn when script is executed directly
    port = int(os.getenv("PORT", 9000))
    logger.info(f"Starting Traxler Vision API on port {port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
