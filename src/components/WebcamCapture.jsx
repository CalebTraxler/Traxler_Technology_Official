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

    // Using only the Llama 4 Scout model
    const MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

    // API base URL - change port if needed
    const API_BASE_URL = 'http://localhost:9000';

    // Helper function to convert base64 to blob
    const base64ToBlob = async (base64Data) => {
        // Remove the data URL prefix if it exists
        const base64WithoutPrefix = base64Data.includes(',') 
            ? base64Data.split(',')[1] 
            : base64Data;
        
        // Decode base64
        const byteCharacters = atob(base64WithoutPrefix);
        const byteArrays = [];
        
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        
        return new Blob(byteArrays, { type: 'image/jpeg' });
    };

    // Check for camera permissions on component mount
    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                // Release the stream immediately
                stream.getTracks().forEach(track => track.stop());
            } catch (err) {
                console.error('Camera permission error:', err);
                setError('Camera permission denied. Please allow camera access and refresh the page.');
            }
        };
        
        checkPermissions();
    }, []);

    // Function to capture and analyze image
    const captureAndAnalyze = async () => {
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
                throw new Error('Could not capture image');
            }

            // Save image for later use
            setLastCapturedImage(imageSrc);

            // Convert base64 to blob directly (avoid fetch)
            const blob = await base64ToBlob(imageSrc);

            // Prepare form data
            const formData = new FormData();
            formData.append('file', blob, 'image.jpg');

            // If there's a context prompt, use it instead of default analysis
            if (contextPrompt.trim()) {
                formData.append('question', contextPrompt);
            }

            // Send to analyze API
            const apiResponse = await fetch(`${API_BASE_URL}/api/analyze`, {
                method: 'POST',
                body: formData
            });

            if (!apiResponse.ok) {
                throw new Error(`Server error: ${apiResponse.status}`);
            }

            // Parse response
            const data = await apiResponse.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Update state with analysis
            setAnalysis(data.analysis);

            // Switch to chat mode
            setChatMode(true);
            setChatHistory([]);

        } catch (err) {
            setError(err.message);
            console.error('Detailed analysis error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to ask question about image
    const askQuestion = async (e) => {
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
            // Convert image to blob using the direct method
            const blob = await base64ToBlob(lastCapturedImage);

            // Create a FormData object for the API call
            const formData = new FormData();
            formData.append('file', blob, 'image.jpg');
            formData.append('question', question);

            // Send to the analyze endpoint with the question
            const apiResponse = await fetch(`${API_BASE_URL}/api/analyze`, {
                method: 'POST',
                body: formData
            });

            if (!apiResponse.ok) {
                throw new Error(`Server error: ${apiResponse.status}`);
            }

            // Parse response
            const data = await apiResponse.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Add to chat history
            setChatHistory(prev => [
                ...prev,
                { question, answer: data.analysis }
            ]);

            // Clear question input
            setQuestion('');

        } catch (err) {
            setError(err.message);
            console.error('Detailed chat error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Reset to capture mode
    const resetToCapture = () => {
        setChatMode(false);
        setChatHistory([]);
        setLastCapturedImage(null);
        setAnalysis('Waiting for analysis...');
        setError(null);
        setContextPrompt('');
    };

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-12">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Vision AI Platform</h1>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Experience real-time image analysis powered by cutting-edge AI. Capture, analyze, and interact with visual content instantly.
                    </p>
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
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            className="w-full h-64 object-cover"
                                            mirrored={true}
                                        />
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
                                                        <span className="font-medium">Powered by:</span> Llama 4 Scout 17B
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={captureAndAnalyze}
                                                disabled={loading}
                                                className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition shadow-md flex items-center justify-center"
                                            >
                                                {loading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Analyzing...
                                                    </>
                                                ) : (
                                                    'Analyze Image'
                                                )}
                                            </button>
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

                                            <button
                                                type="button"
                                                onClick={resetToCapture}
                                                className="w-full p-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition shadow-sm"
                                            >
                                                Capture New Image
                                            </button>
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
                                {!chatMode ? (
                                    // Analysis results
                                    <>
                                        <h2 className="text-xl font-bold text-blue-900 mb-4">Analysis Results</h2>
                                        <div className="bg-gray-50 p-5 rounded-lg h-64 overflow-y-auto whitespace-pre-line border border-gray-200 shadow-inner">
                                            {analysis}
                                        </div>
                                    </>
                                ) : (
                                    // Chat history
                                    <>
                                        <h2 className="text-xl font-bold text-blue-900 mb-4">Conversation</h2>
                                        <div className="bg-gray-50 p-5 rounded-lg h-96 overflow-y-auto border border-gray-200 shadow-inner">
                                            {/* Initial analysis */}
                                            <div className="mb-6">
                                                <div className="font-semibold text-blue-700 mb-2">
                                                    {contextPrompt
                                                        ? <span>AI Response to: <i>"{contextPrompt}"</i></span>
                                                        : "AI Analysis:"}
                                                </div>
                                                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">{analysis}</div>
                                            </div>

                                            {/* Chat messages */}
                                            {chatHistory.map((chat, index) => (
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Interactive AI Chat</h3>
                        <p className="text-gray-600">Ask specific questions about your images and receive concise, relevant answers from our advanced AI assistant.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="text-blue-600 mb-4">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Secure Processing</h3>
                        <p className="text-gray-600">Your images are processed securely with our enterprise-grade API infrastructure, ensuring privacy and data protection.</p>
                    </div>
                </div>

                {/* How to Use Section */}
                <div className="mt-12 bg-white rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-bold text-blue-900 mb-6">How to Use Traxler Vision AI</h2>
                    <div className="grid md:grid-cols-5 gap-4">
                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-800 mx-auto mb-3 font-bold">1</div>
                            <p>Position your webcam to frame the subject</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-800 mx-auto mb-3 font-bold">2</div>
                            <p>Add an optional context prompt</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-800 mx-auto mb-3 font-bold">3</div>
                            <p>Click "Analyze Image" to capture</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-800 mx-auto mb-3 font-bold">4</div>
                            <p>Ask specific questions about the image</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-800 mx-auto mb-3 font-bold">5</div>
                            <p>Click "Capture New Image" to restart</p>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <p className="inline-block py-2 px-4 bg-blue-50 text-blue-700 rounded-full font-medium">
                            Powered by Llama 4 Scout 17B for advanced image analysis
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WebcamCapture;
