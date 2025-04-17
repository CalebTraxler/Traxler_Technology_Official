

# Backend:
# cd C:\Users\caleb\source\repos\life_ai\life_ai\backend
# uvicorn main:app --reload --port 9000

# Frontend: 
# cd C:\Users\caleb\source\repos\life_ai\life_ai
# npm run dev

from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import base64
import os
import requests
import json
from typing import Optional, Dict, List, Any
import io
from groq import Groq
import logging
import time
import uvicorn
from pydantic import BaseModel
from uuid import uuid4

# LangChain imports
from langchain.memory import ConversationBufferMemory
from langchain_core.messages import HumanMessage, AIMessage

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
    description="Enterprise-grade image analysis platform powered by Llama 4 Scout 17B Vision model with conversation memory.",
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
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # Get from environment or set your key here

# Initialize Groq client
try:
    groq_client = Groq(api_key=GROQ_API_KEY)
    logger.info("✅ Groq client initialized successfully")
except Exception as e:
    logger.error(f"❌ Failed to initialize Groq client: {str(e)}")
    groq_client = None

# Memory stores - conversation buffer memories
buffer_memories: Dict[str, ConversationBufferMemory] = {}

# Health check model
class HealthResponse(BaseModel):
    status: str
    message: str
    version: str

# Session model
class SessionRequest(BaseModel):
    session_id: Optional[str] = None

class SessionResponse(BaseModel):
    session_id: str

# Memory Storage Request
class MemoryRequest(BaseModel):
    session_id: str
    human_message: str
    ai_message: str

# Root endpoint for health check
@app.get("/", response_model=HealthResponse)
async def root():
    return {
        "status": "online",
        "message": "Traxler Vision API is operational with conversation memory",
        "version": "1.1.0"
    }

# Create a new session
@app.post("/api/session", response_model=SessionResponse)
async def create_session(request: SessionRequest):
    session_id = request.session_id or str(uuid4())
    
    # Create the buffer memory
    buffer_memories[session_id] = ConversationBufferMemory(return_messages=True)
    
    logger.info(f"Created new session with ID: {session_id}")
    
    return {
        "session_id": session_id
    }

# Store memory
@app.post("/api/memory", status_code=status.HTTP_204_NO_CONTENT)
async def store_memory(request: MemoryRequest):
    session_id = request.session_id
    
    # Check if session exists in buffer memory
    if session_id in buffer_memories:
        memory = buffer_memories[session_id]
        memory.chat_memory.add_user_message(request.human_message)
        memory.chat_memory.add_ai_message(request.ai_message)
        logger.info(f"Added memory to session: {session_id}")
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session with ID {session_id} not found."
        )
    
    return None

# Get memory for a session
@app.get("/api/memory/{session_id}")
async def get_memory(session_id: str):
    # Check if session exists in buffer memory
    if session_id in buffer_memories:
        memory = buffer_memories[session_id]
        return {
            "session_id": session_id,
            "messages": memory.chat_memory.messages
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session with ID {session_id} not found."
        )

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

# Extract session ID from form data
def get_session_id(session_id: Optional[str] = Form(None)) -> Optional[str]:
    """Extract the session ID from form data"""
    return session_id

# No model selection function - using only Llama 4 Scout model
MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"

# Combined analyze/question endpoint with Llama 4 Vision integration via Groq
@app.post("/api/analyze")
async def analyze_image(
    file: UploadFile = File(...),
    question: Optional[str] = Depends(get_question),  # Use dependency for question extraction
    session_id: Optional[str] = Depends(get_session_id)  # Extract session ID
):
    request_id = f"req_{int(time.time())}"
    logger.info(f"[{request_id}] Processing new request with Llama 4 Scout model | Question: '{question or 'None'}'")
    
    # Check if session exists, if not create a new one
    if session_id and session_id not in buffer_memories:
        buffer_memories[session_id] = ConversationBufferMemory(return_messages=True)
        logger.info(f"[{request_id}] Created new memory for session: {session_id}")
    elif not session_id:
        # Create a new session ID if none provided
        session_id = str(uuid4())
        buffer_memories[session_id] = ConversationBufferMemory(return_messages=True)
        logger.info(f"[{request_id}] Created new session with ID: {session_id}")
    
    try:
        # Read the uploaded image
        img_bytes = await file.read()
        img_size_kb = len(img_bytes) / 1024
        logger.info(f"[{request_id}] Image received | Name: {file.filename} | Size: {img_size_kb:.2f}KB")
        
        # Encode for API
        img_base64 = base64.b64encode(img_bytes).decode()
        
        # Create data URL for image
        frame_data = f"data:image/jpeg;base64,{img_base64}"
        
        # Get memory content to add to the prompt
        memory_content = ""
        if session_id in buffer_memories:
            # Format buffer memory for the prompt
            messages = buffer_memories[session_id].chat_memory.messages
            if messages:
                memory_content = "Previous conversation history:\n"
                for i, msg in enumerate(messages):
                    if isinstance(msg, HumanMessage):
                        memory_content += f"Human: {msg.content}\n"
                    elif isinstance(msg, AIMessage):
                        memory_content += f"AI: {msg.content}\n"
                
                # Add explicit instruction to use memory content
                memory_content += "\nRefer to this conversation history when answering the current question.\n\n"
        
        # Prepare the prompt based on whether a question was asked
        if question is not None:
            # For the Ask button with a specific question
            logger.info(f"[{request_id}] QUESTION MODE: '{question}'")
            
            # Include memory in the prompt if available
            if memory_content:
                user_prompt = f"{memory_content}Current question about this image: {question}\nPlease respond concisely but completely."
            else:
                user_prompt = f"Question about this image: {question}\nPlease respond concisely but completely."
        else:
            # For the Analyze Image button without a specific question
            logger.info(f"[{request_id}] ANALYSIS MODE (general description)")
            
            # Include memory in the prompt if available
            if memory_content:
                user_prompt = f"{memory_content}Describe what you see in this image in a concise, professional manner."
            else:
                user_prompt = "Describe what you see in this image in a concise, professional manner."
        
        if not groq_client:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Vision service is currently unavailable. Please try again later."
            )
        
        logger.info(f"[{request_id}] Sending request to Groq API with Llama 4 Scout model")
        logger.info(f"[{request_id}] Prompt: {user_prompt}")
        
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
                max_tokens=150,  # Increased token limits to accommodate memory
                temperature=0.7 if question is None else 0.2,  # Adjusted temperature
            )
            
            # Extract the response text
            analysis = chat_completion.choices[0].message.content.strip()
            processing_time = time.time() - start_time
            logger.info(f"[{request_id}] Groq API response received | Time: {processing_time:.2f}s")
            
            # Store the interaction in memory
            if question is not None:
                human_message = question
            else:
                human_message = "Analyze this image"
                
            if session_id in buffer_memories:
                memory = buffer_memories[session_id]
                memory.chat_memory.add_user_message(human_message)
                memory.chat_memory.add_ai_message(analysis)
                logger.info(f"[{request_id}] Stored interaction in memory for session: {session_id}")
            
        except Exception as groq_error:
            logger.error(f"[{request_id}] Groq API error: {str(groq_error)}")
            
            # Return proper error response
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Error communicating with vision service: " + str(groq_error)
            )
        
        logger.info(f"[{request_id}] Analysis complete | Response: '{analysis}'")
        
        # Return analysis with session info
        return {
            "analysis": analysis,
            "session_id": session_id
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

# Clear memory for a session
@app.delete("/api/memory/{session_id}")
async def clear_memory(session_id: str):
    # Check if session exists in buffer memory
    if session_id in buffer_memories:
        buffer_memories[session_id] = ConversationBufferMemory(return_messages=True)
        logger.info(f"Cleared memory for session: {session_id}")
        return {"status": "success", "message": "Memory cleared successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session with ID {session_id} not found."
        )

# Delete a session
@app.delete("/api/session/{session_id}")
async def delete_session(session_id: str):
    # Check if session exists in buffer memory
    if session_id in buffer_memories:
        del buffer_memories[session_id]
        logger.info(f"Deleted session: {session_id}")
        return {"status": "success", "message": "Session deleted successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session with ID {session_id} not found."
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
