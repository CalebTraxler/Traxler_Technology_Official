// ES Module version for Vercel serverless function
import { Groq } from 'groq-sdk';
import formidable from 'formidable';
import { readFileSync } from 'fs';

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

// Main serverless function handler
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

        if (!file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        console.log(`Image received | Name: ${file.originalFilename} | Size: ${file.size / 1024}KB`);

        // Read the file and convert to Base64
        const imgBase64 = readFileAsBase64(file.filepath);

        // Create data URL for image
        const frameData = `data:${file.mimetype};base64,${imgBase64}`;

        // Prepare the prompt based on whether a question was asked
        let userPrompt;
        if (question) {
            console.log(`QUESTION MODE: '${question}'`);
            userPrompt = `Question about this image: ${question}\nPlease respond concisely but completely in one short sentence.`;
        } else {
            console.log(`ANALYSIS MODE (general description)`);
            userPrompt = "Describe what you see in this image in a concise, professional manner.";
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
            max_tokens: question ? 50 : 75,  // Adjusted token limits
            temperature: question ? 0.2 : 0.7,  // Adjusted temperature
        });

        // Extract the response text
        const analysis = chatCompletion.choices[0].message.content.trim();
        const processingTime = (Date.now() - startTime) / 1000;

        console.log(`Response received | Time: ${processingTime.toFixed(2)}s`);
        console.log(`Analysis complete | Response: '${analysis}'`);

        // Return analysis
        return res.status(200).json({ analysis });

    } catch (error) {
        console.error(`Unhandled exception: ${error.message}`);
        return res.status(500).json({
            error: `An unexpected error occurred: ${error.message}`,
            analysis: "Failed to analyze image"
        });
    }
}
