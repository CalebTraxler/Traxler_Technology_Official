// ES Module version for Vercel serverless function
import { Groq } from 'groq-sdk';
import formidable from 'formidable';
import { readFileSync } from 'fs';

// MEMORY STORAGE
// In a production app, you should use a database instead of in-memory storage
// This example uses a simple memory store that will be reset when the serverless function restarts
let conversationMemories = {};
let sessionTimestamps = {};
const SESSION_EXPIRY_SECONDS = 3600; // 1 hour

// More robust API key handling
const getGroqApiKey = () => {
    // Try different ways to access the environment variable
    const apiKey = process.env.GROQ_API_KEY || 
                  process.env.NEXT_PUBLIC_GROQ_API_KEY || 
                  process.env.VERCEL_GROQ_API_KEY;
    
    if (!apiKey) {
        console.error("GROQ API KEY NOT FOUND IN ANY ENVIRONMENT VARIABLE");
        throw new Error("GROQ API key not found in environment variables");
    }
    
    return apiKey;
};

// Set Llama model
const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

// Helper to parse multipart form data
const parseForm = async (req) => {
    return new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });
};

// Helper to read file as Base64
const readFileAsBase64 = (filePath) => {
    const fileBuffer = readFileSync(filePath);
    return Buffer.from(fileBuffer).toString('base64');
};

// Get or create session
const getOrCreateSession = (sessionId) => {
    // Create new session if doesn't exist
    if (!sessionId || !conversationMemories[sessionId]) {
        sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
        console.log(`Creating new session: ${sessionId}`);
        conversationMemories[sessionId] = {
            messages: []
        };
    }
    
    // Update session timestamp
    sessionTimestamps[sessionId] = Date.now();
    
    return sessionId;
};

// Add message to memory
const addMessageToMemory = (sessionId, role, content) => {
    if (!conversationMemories[sessionId]) {
        console.warn(`Session ${sessionId} not found, creating new session`);
        conversationMemories[sessionId] = { messages: [] };
    }
    
    conversationMemories[sessionId].messages.push({ role, content });
    console.log(`Added ${role} message to session ${sessionId}. Total messages: ${conversationMemories[sessionId].messages.length}`);
    
    return getMemoryStats(sessionId);
};

// Get memory stats
const getMemoryStats = (sessionId) => {
    if (!conversationMemories[sessionId]) {
        return {
            message_count: 0,
            characters: 0,
            tokens_estimate: 0
        };
    }
    
    const messages = conversationMemories[sessionId].messages;
    const charCount = messages.reduce((sum, msg) => sum + msg.content.length, 0);
    
    return {
        message_count: messages.length,
        characters: charCount,
        tokens_estimate: Math.floor(charCount / 4) // Rough estimate
    };
};

// Cleanup expired sessions (can't use this in serverless but good practice)
const cleanupExpiredSessions = () => {
    const now = Date.now();
    Object.keys(sessionTimestamps).forEach(sessionId => {
        if (now - sessionTimestamps[sessionId] > SESSION_EXPIRY_SECONDS * 1000) {
            console.log(`Cleaning up expired session: ${sessionId}`);
            delete conversationMemories[sessionId];
            delete sessionTimestamps[sessionId];
        }
    });
};

// Handler for memory endpoint
export async function memoryHandler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle OPTIONS method (preflight request)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Parse cookies for session_id
    const cookies = req.headers.cookie?.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
    }, {}) || {};
    
    // Get session ID from various sources
    let sessionId = cookies.session_id;
    
    // Check for session_id in query params or path
    if (req.query.session_id) {
        sessionId = req.query.session_id;
    } else if (req.url) {
        // Extract session_id from path if in format /api/memory/[session_id]
        const pathMatch = req.url.match(/\/api\/memory\/([^\/]+)/);
        if (pathMatch && pathMatch[1]) {
            sessionId = pathMatch[1];
        }
    }
    
    console.log(`Memory handler processing request for session: ${sessionId}`);
    
    // If this is a DELETE request, clear the memory
    if (req.method === 'DELETE') {
        if (!sessionId || !conversationMemories[sessionId]) {
            return res.status(404).json({
                error: 'Session not found'
            });
        }
        
        conversationMemories[sessionId] = { messages: [] };
        console.log(`Cleared memory for session ${sessionId}`);
        
        const stats = getMemoryStats(sessionId);
        return res.status(200).json({
            session_id: sessionId,
            stats: stats,
            status: 'cleared',
            memory_type: 'buffer'
        });
    }

    // For GET requests, get or create a session
    sessionId = getOrCreateSession(sessionId);
    
    // Set the session cookie
    res.setHeader('Set-Cookie', `session_id=${sessionId}; Max-Age=${SESSION_EXPIRY_SECONDS}; Path=/; HttpOnly; SameSite=Lax`);
    
    const stats = getMemoryStats(sessionId);
    return res.status(200).json({
        session_id: sessionId,
        stats: stats,
        status: 'active',
        memory_type: 'buffer'
    });
}

// Main handler for analyze endpoint
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle OPTIONS method (preflight request)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST method
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Please use POST.' });
    }

    try {
        console.log("Processing new request with Llama 4 Scout model");
        
        // Initialize Groq client - Only create when needed
        let groqClient;
        try {
            const apiKey = getGroqApiKey();
            console.log("API Key found, initializing Groq client");
            groqClient = new Groq({ apiKey });
        } catch (keyError) {
            console.error("API Key error:", keyError.message);
            return res.status(500).json({ 
                error: "API key configuration error. Please check server configuration.",
                details: keyError.message
            });
        }

        // Parse the form data
        const { fields, files } = await parseForm(req);
        const file = files.file;
        const question = fields.question;
        
        // Get session ID from cookie or form
        let sessionId;
        
        // Parse cookies
        const cookies = req.headers.cookie?.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {}) || {};
        
        sessionId = cookies.session_id || fields.session_id;
        sessionId = getOrCreateSession(sessionId);
        
        // Set the session cookie
        res.setHeader('Set-Cookie', `session_id=${sessionId}; Max-Age=${SESSION_EXPIRY_SECONDS}; Path=/; HttpOnly; SameSite=Lax`);

        if (!file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        console.log(`Image received | Name: ${file.originalFilename} | Size: ${file.size / 1024}KB`);

        // Read the file and convert to Base64
        const imgBase64 = readFileAsBase64(file.filepath);

        // Create data URL for image
        const frameData = `data:${file.mimetype};base64,${imgBase64}`;

        // Get conversation history from memory
        let memoryContext = "";
        if (conversationMemories[sessionId] && conversationMemories[sessionId].messages.length > 0) {
            // Format the memory context more explicitly to ensure model uses it
            memoryContext = "\n\nIMPORTANT CONVERSATION HISTORY (Reference this to answer user questions):\n";
            conversationMemories[sessionId].messages.forEach((msg, index) => {
                memoryContext += `[${index + 1}] ${msg.role}: ${msg.content}\n`;
            });
            console.log("Adding memory context with " + conversationMemories[sessionId].messages.length + " messages");
        }

        // Create a more explicit instruction to use the memory context
        let userPrompt;
        if (question) {
            console.log(`QUESTION MODE: '${question}'`);
            userPrompt = `Question about this image: ${question}\n\nUse both the image AND the conversation history below to answer the question. If information was provided in earlier messages, use that information in your answer.${memoryContext}\n\nPlease respond concisely but completely.`;
            
            // Add user question to memory
            addMessageToMemory(sessionId, 'user', question);
        } else {
            console.log(`ANALYSIS MODE (general description)`);
            userPrompt = `Describe what you see in this image in a concise, professional manner.${memoryContext}`;
        }

        console.log("Sending request to Groq API with Llama 4 Scout model");

        const startTime = Date.now();

        // Create the messages array with text and image
        const chatCompletion = await groqClient.chat.completions.create({
            messages: [
                {
                    "role": "user",
                    "content": [
                        { "type": "text", "text": userPrompt },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": frameData,
                            },
                        },
                    ],
                }
            ],
            model: MODEL,  // Use the Llama 4 Scout model
            max_tokens: question ? 75 : 100,  // Adjusted token limits
            temperature: question ? 0.2 : 0.7,  // Adjusted temperature
        });

        // Extract the response text
        const analysis = chatCompletion.choices[0].message.content.trim();
        const processingTime = (Date.now() - startTime) / 1000;

        console.log(`Response received | Time: ${processingTime.toFixed(2)}s`);
        console.log(`Analysis complete | Response: '${analysis}'`);
        
        // Add AI response to memory
        addMessageToMemory(sessionId, 'ai', analysis);
        
        // Get memory stats
        const memoryStats = getMemoryStats(sessionId);

        // Return analysis with session and memory information
        return res.status(200).json({ 
            analysis, 
            session_id: sessionId,
            memory_stats: memoryStats,
            memory_type: 'buffer'
        });

    } catch (error) {
        console.error(`Unhandled exception: ${error.message}`);
        return res.status(500).json({
            error: `An unexpected error occurred: ${error.message}`,
            analysis: "Failed to analyze image"
        });
    }
}
