
import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = () => {
    const webcamRef = useRef(null);
    const [analysis, setAnalysis] = useState('Waiting for analysis...');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [question, setQuestion] = useState('');
    const [chatMode, setChatMode] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [lastCapturedImage, setLastCapturedImage] = useState(null);
    const [contextPrompt, setContextPrompt] = useState('');
    const [cameraPermission, setCameraPermission] = useState(false);
    const [facingMode, setFacingMode] = useState("user");
    
    // Memory-related state
    const [sessionId, setSessionId] = useState(null);
    const [memoryStats, setMemoryStats] = useState({
        message_count: 0,
        characters: 0,
        tokens_estimate: 0
    });
    const [isMemoryClearing, setIsMemoryClearing] = useState(false);

    // Using only the Llama 4 Scout model
    const MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

    // API base URL - Always use relative URL for Vercel deployments
    const API_BASE_URL = '/api/analyze';
    const MEMORY_API_URL = '/api/memory';

    // Detect if running on mobile
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
            setIsMobile(mobileRegex.test(userAgent));
        };
        checkMobile();
    }, []);

    // Initialize session and memory on component mount
    useEffect(() => {
        fetchMemoryStats();
    }, []);

    // Fetch memory stats
    const fetchMemoryStats = async () => {
        try {
            const response = await fetch(MEMORY_API_URL, {
                credentials: 'include'  // For cookies
            });
            
            if (response.ok) {
                const data = await response.json();
                setSessionId(data.session_id);
                setMemoryStats(data.stats);
                console.log(`Connected to session: ${data.session_id}`);
            } else {
                console.error("Failed to fetch memory stats:", await response.text());
            }
        } catch (err) {
            console.error('Error fetching memory stats:', err);
        }
    };

    // Handler for clearing memory
    const handleClearMemory = async () => {
        if (!sessionId) return;
        
        setIsMemoryClearing(true);
        try {
            const response = await fetch(`${MEMORY_API_URL}/${sessionId}`, {
                method: 'DELETE',
                credentials: 'include'  // For cookies
            });
            
            if (response.ok) {
                const data = await response.json();
                setMemoryStats(data.stats);
                console.log("Memory cleared for session:", data.session_id);
                
                // Also clear chat history in the UI
                setChatHistory([]);
                setAnalysis('Memory cleared. Start a new conversation.');
            } else {
                setError("Failed to clear memory: " + (await response.text()));
            }
        } catch (err) {
            setError("Error clearing memory: " + err.message);
        } finally {
            setIsMemoryClearing(false);
        }
    };

    // Optimized video constraints based on device
    const videoConstraints = {
        width: isMobile ? { ideal: 640, max: 1280 } : { ideal: 1280, max: 1920 },
        height: isMobile ? { ideal: 480, max: 720 } : { ideal: 720, max: 1080 },
        facingMode: facingMode,
        aspectRatio: 1.3333333
    };

    // Toggle camera between front and back
    const toggleCamera = useCallback(() => {
        setFacingMode(prevMode => prevMode === "user" ? "environment" : "user");
    }, []);

    // Handle successful webcam access
    const handleUserMedia = useCallback(() => {
        console.log("Camera access granted");
        setCameraPermission(true);
        setError(null);
    }, []);

    // Handle webcam errors
    const handleUserMediaError = useCallback((err) => {
        console.error("Camera error:", err.name, err.message);
        setCameraPermission(false);
        setError(`Camera error: ${err.name || "unknown"}. ${err.message || "Please check browser permissions."}`);
    }, []);

    // Convert data URL to Blob for API submission
    const dataURLtoBlob = useCallback((dataURL) => {
        try {
            // Convert base64/URLEncoded data component to raw binary data
            const byteString = atob(dataURL.split(',')[1]);
            const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
            
            // Write bytes into an ArrayBuffer
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const uint8Array = new Uint8Array(arrayBuffer);
            
            for (let i = 0; i < byteString.length; i++) {
                uint8Array[i] = byteString.charCodeAt(i);
            }
            
            // Write the ArrayBuffer to a Blob and return it
            return new Blob([arrayBuffer], { type: mimeString });
        } catch (error) {
            console.error("Error converting data URL to Blob:", error);
            throw new Error("Failed to process image data");
        }
    }, []);

    // Function to capture and analyze image
    const captureAndAnalyze = useCallback(async () => {
        if (!webcamRef.current) {
            setError('Webcam not available');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            // Capture image
            const imageSrc = webcamRef.current.getScreenshot();
            
            if (!imageSrc) {
                throw new Error('Could not capture image from camera');
            }
            
            console.log("Image captured successfully");
            
            // Save image for chat mode
            setLastCapturedImage(imageSrc);
            
            // Convert to blob - use our dedicated function for better mobile compatibility
            const blob = dataURLtoBlob(imageSrc);
            
            // Prepare form data
            const formData = new FormData();
            formData.append('file', blob, 'image.jpg');
            
            // Add session info if available
            if (sessionId) {
                formData.append('session_id', sessionId);
            }
            
            if (contextPrompt.trim()) {
                formData.append('question', contextPrompt);
            }
            
            // Send to API
            console.log("Sending image to API...");
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                body: formData,
                credentials: 'include'  // Important for cookies
            });
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            
            // Parse response
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Update state with analysis
            setAnalysis(data.analysis);
            
            // Update session and memory stats if provided
            if (data.session_id) {
                setSessionId(data.session_id);
            }
            
            if (data.memory_stats) {
                setMemoryStats(data.memory_stats);
            }
            
            // Switch to chat mode
            setChatMode(true);
            
            // Initialize chat history with the first analysis 
            if (contextPrompt.trim()) {
                setChatHistory([{ 
                    type: 'context',
                    prompt: contextPrompt,
                    answer: data.analysis 
                }]);
            } else {
                setChatHistory([]);
            }
            
        } catch (err) {
            console.error("Error in captureAndAnalyze:", err);
            setError(err.message || "Failed to analyze image");
        } finally {
            setLoading(false);
        }
    }, [webcamRef, contextPrompt, dataURLtoBlob, API_BASE_URL, sessionId]);

    // Function to ask question about image
    const askQuestion = useCallback(async (e) => {
        e.preventDefault();

        if (!question.trim()) {
            setError('Please enter a question');
            return;
        }

        if (!lastCapturedImage) {
            setError('No image available');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Convert image to blob
            const blob = dataURLtoBlob(lastCapturedImage);
            
            // Create form data
            const formData = new FormData();
            formData.append('file', blob, 'image.jpg');
            formData.append('question', question);
            
            // Add session info if available
            if (sessionId) {
                formData.append('session_id', sessionId);
            }
            
            // Send to API with credentials for session cookies
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Update session and memory stats if provided
            if (data.session_id) {
                setSessionId(data.session_id);
            }
            
            if (data.memory_stats) {
                setMemoryStats(data.memory_stats);
            }
            
            // Add to chat history
            setChatHistory(prev => [
                ...prev,
                { type: 'qa', question, answer: data.analysis }
            ]);
            
            // Clear question input
            setQuestion('');
            
        } catch (err) {
            console.error("Error asking question:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [question, lastCapturedImage, dataURLtoBlob, API_BASE_URL, sessionId]);

    // Reset to capture mode
    const resetToCapture = useCallback(() => {
        setChatMode(false);
        setChatHistory([]);
        setLastCapturedImage(null);
        setAnalysis('Waiting for analysis...');
        setError(null);
        setContextPrompt('');
        // Note: We don't clear the memory/session when resetting to capture mode
    }, []);

    // Format number with commas for display
    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
    };

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-12">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Vision AI Platform</h1>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Experience real-time image analysis powered by cutting-edge AI with conversation memory.
                    </p>
                    {sessionId && (
                        <div className="inline-flex bg-blue-800 px-4 py-2 rounded-full text-xs font-medium">
                            Session ID: {sessionId.substring(0, 8)}...
                        </div>
                    )}
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    {/* App Container */}
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Left column - Image capture/display */}
                            <div className="md:w-1/2">
                                <h2 className="text-xl font-bold text-blue-900 mb-4">Image Analysis</h2>
                                <div className="bg-black rounded-lg overflow-hidden shadow-inner">
                                    {!chatMode ? (
                                        <div className="relative">
                                            <Webcam
                                                audio={false}
                                                ref={webcamRef}
                                                screenshotFormat="image/jpeg"
                                                className="w-full h-64 object-cover"
                                                mirrored={facingMode === "user"}
                                                videoConstraints={videoConstraints}
                                                onUserMedia={handleUserMedia}
                                                onUserMediaError={handleUserMediaError}
                                                forceScreenshotSourceSize={true}
                                                screenshotQuality={0.92}
                                            />
                                            {isMobile && cameraPermission && (
                                                <button 
                                                    onClick={toggleCamera}
                                                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                                                    aria-label="Switch camera"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4v16M8 4v16m4-16v16m4-16v16M4 4h16M4 8h16M4 12h16M4 16h16M4 20h16"></path>
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        lastCapturedImage && (
                                            <img
                                                src={lastCapturedImage}
                                                alt="Captured"
                                                className="w-full h-64 object-contain"
                                            />
                                        )
                                    )}
                                </div>

                                <div className="mt-4 space-y-3">
                                    {!chatMode ? (
                                        // Capture mode controls with context prompt input
                                        <>
                                            <div className="mb-3">
                                                <input
                                                    type="text"
                                                    placeholder="Enter a context prompt (optional)..."
                                                    value={contextPrompt}
                                                    onChange={(e) => setContextPrompt(e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                />
                                                <p className="text-xs text-gray-600 mt-1">
                                                    Add context to guide the analysis (e.g., "Check if I'm dressed appropriately for work")
                                                </p>
                                            </div>

                                            <div className="mb-3">
                                                <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                                                    <p className="text-sm text-blue-800">
                                                        <span className="font-medium">Powered by:</span> Llama 4 Scout 17B with Conversation Memory
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={captureAndAnalyze}
                                                    disabled={loading || !cameraPermission}
                                                    className="flex-1 p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition shadow-md flex items-center justify-center"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Analyzing...
                                                        </>
                                                    ) : !cameraPermission ? (
                                                        'Camera Initializing...'
                                                    ) : (
                                                        'Analyze Image'
                                                    )}
                                                </button>
                                                
                                                <button
                                                    onClick={handleClearMemory}
                                                    disabled={loading || isMemoryClearing || !sessionId || memoryStats.message_count === 0}
                                                    className="p-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition shadow-md flex items-center justify-center"
                                                    title="Clear memory for this session"
                                                >
                                                    {isMemoryClearing ? (
                                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        // Chat mode controls
                                        <form onSubmit={askQuestion} className="space-y-3">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Ask about this image..."
                                                    value={question}
                                                    onChange={(e) => setQuestion(e.target.value)}
                                                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                    disabled={loading}
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={loading || !question.trim()}
                                                    className="px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition shadow-md flex items-center justify-center"
                                                >
                                                    {loading ? (
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        'Ask'
                                                    )}
                                                </button>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={resetToCapture}
                                                    className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition shadow-sm"
                                                >
                                                    Capture New Image
                                                </button>
                                                
                                                <button
                                                    type="button"
                                                    onClick={handleClearMemory}
                                                    disabled={isMemoryClearing || !sessionId || memoryStats.message_count === 0}
                                                    className="flex-1 p-3 bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 transition shadow-sm flex items-center justify-center"
                                                >
                                                    {isMemoryClearing ? (
                                                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                    )}
                                                    Clear Memory
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {error && (
                                        <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-md">
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                                </svg>
                                                {error}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right column - Results */}
                            <div className="md:w-1/2">
                                {/* Memory stats display - always visible */}
                                <div className="mb-4 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-blue-900">
                                        {!chatMode ? "Analysis Results" : "Conversation"}
                                    </h2>
                                    
                                    {/* Memory status indicator */}
                                    <div className="flex items-center bg-gray-100 py-1 px-3 rounded-full text-xs">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${memoryStats.message_count > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                        <div className="flex flex-col">
                                            <span className="font-medium">Memory Status</span>
                                            <span className="text-gray-500">{memoryStats.message_count} messages stored</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {!chatMode ? (
                                    // Analysis results
                                    <>
                                        <div className="bg-gray-50 p-5 rounded-lg h-64 overflow-y-auto whitespace-pre-line border border-gray-200 shadow-inner">
                                            {analysis}
                                        </div>
                                    </>
                                ) : (
                                    // Chat history with memory context
                                    <>
                                        <div className="bg-gray-50 p-5 rounded-lg h-96 overflow-y-auto border border-gray-200 shadow-inner">
                                            {/* Memory indicator */}
                                            {memoryStats.message_count > 0 && (
                                                <div className="mb-4 p-2 bg-blue-50 border border-blue-100 rounded-md">
                                                    <p className="text-xs text-blue-700 flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        AI has memory of this conversation ({memoryStats.message_count} messages)
                                                    </p>
                                                </div>
                                            )}
                                        
                                            {/* Initial analysis */}
                                            {chatHistory.length > 0 && chatHistory[0].type === 'context' ? (
                                                <div className="mb-6">
                                                    <div className="font-semibold text-blue-700 mb-2">
                                                        <span>AI Response to: <i>"{chatHistory[0].prompt}"</i></span>
                                                    </div>
                                                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">{chatHistory[0].answer}</div>
                                                </div>
                                            ) : (
                                                <div className="mb-6">
                                                    <div className="font-semibold text-blue-700 mb-2">AI Analysis:</div>
                                                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">{analysis}</div>
                                                </div>
                                            )}

                                            {/* Chat messages */}
                                            {chatHistory.filter(chat => chat.type === 'qa').map((chat, index) => (
                                                <div key={index} className="mb-6">
                                                    <div className="font-semibold text-gray-700 mb-2">You asked:</div>
                                                    <div className="bg-gray-100 p-3 rounded-lg mb-3">{chat.question}</div>

                                                    <div className="font-semibold text-blue-700 mb-2">AI answered:</div>
                                                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">{chat.answer}</div>
                                                </div>
                                            ))}

                                            {/* Loading indicator */}
                                            {loading && (
                                                <div className="flex items-center justify-center text-blue-500 p-4">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing your request...
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Section */}
                <div className="mt-12 grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="text-blue-600 mb-4">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Real-time Analysis</h3>
                        <p className="text-gray-600">Instantly analyze images using state-of-the-art Llama 4 Scout vision model, providing accurate and useful insights.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="text-blue-600 mb-4">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Conversation Memory</h3>
                        <p className="text-gray-600">AI remembers context from your previous interactions, providing more relevant and consistent responses throughout your session.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="text-blue-600 mb-4">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Session Management</h3>
                        <p className="text-gray-600">Your conversation persists throughout your session with secure memory handling and the ability to clear history when needed.</p>
                    </div>
                </div>

                {/* How to Use Section */}
                <div className="mt-12 bg-white rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-bold text-blue-900 mb-6">How to Use Traxler Vision AI with Memory</h2>
                    <div className="grid md:grid-cols-5 gap-4">
                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-800 mx-auto mb-3 font-bold">1</div>
                            <p>Position your webcam to frame the subject</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-800 mx-auto mb-3 font-bold">2</div>
                            <p>Add an optional context prompt for guidance</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-800 mx-auto mb-3 font-bold">3</div>
                            <p>Continue the conversation with follow-up questions</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-800 mx-auto mb-3 font-bold">4</div>
                            <p>AI remembers previous context in your session</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-800 mx-auto mb-3 font-bold">5</div>
                            <p>Clear memory or capture new images as needed</p>
                        </div>
                    </div>
                </div>
                
                {/* Session Information */}
                <div className="mt-8 bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-blue-900">Session Information</h2>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {sessionId ? `Active: ${sessionId.substring(0, 8)}...` : 'No active session'}
                        </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="font-medium text-gray-700 mb-2">Memory Statistics</h3>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Messages stored:</span>
                                <span className="font-medium">{memoryStats.message_count}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Characters:</span>
                                <span className="font-medium">{formatNumber(memoryStats.characters)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tokens (est.):</span>
                                <span className="font-medium">{formatNumber(memoryStats.tokens_estimate)}</span>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="font-medium text-gray-700 mb-2">Memory Controls</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Your conversation history is stored in memory for this session. 
                                Sessions automatically expire after 1 hour of inactivity.
                            </p>
                            <button 
                                onClick={handleClearMemory}
                                disabled={isMemoryClearing || !sessionId || memoryStats.message_count === 0}
                                className="w-full p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 transition flex items-center justify-center"
                            >
                                {isMemoryClearing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Clearing Memory...
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                        Clear All Memory
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Footer */}
                <footer className="mt-12 text-center text-gray-500 text-sm pb-8">
                    <p>Powered by Llama 4 Scout 17B Vision Model with LangChain Memory Management</p>
                    <p className="mt-1">© {new Date().getFullYear()} Traxler Technology</p>
                </footer>
            </main>
        </div>
    );
};

export default WebcamCapture;
