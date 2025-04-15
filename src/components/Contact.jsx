
import React from 'react';

const Contact = () => {
    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-16">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Have questions or interested in collaborating? Reach out to us.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-3">Email</h3>
                            <a href="mailto:traxlertechnology@gmail.com" className="flex items-center text-blue-600 hover:text-blue-800 transition">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                </svg>
                                traxlertechnology@gmail.com
                            </a>
                            <p className="text-gray-600 mt-2">
                                For inquiries, collaboration opportunities, or questions about our services.
                            </p>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-3">Location</h3>
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                                </svg>
                                <div>
                                    <p className="text-gray-800">University of California, Irvine</p>
                                    <p className="text-gray-600">Irvine, CA 92697</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-3">Connect</h3>
                            <div className="flex space-x-4">
                                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                                    </svg>
                                </a>
                                <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                                    </svg>
                                </a>
                                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="What is this regarding?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    rows="5"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="Your message here..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-md"
                            >
                                Send Message
                            </button>

                            <p className="text-sm text-gray-600 mt-4">
                                Alternatively, you can email us directly at <a href="mailto:traxlertechnology@gmail.com" className="text-blue-600 hover:underline">traxlertechnology@gmail.com</a>
                            </p>
                        </form>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16 bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>

                    <div className="space-y-6 max-w-3xl mx-auto">
                        <div>
                            <h3 className="font-bold text-lg mb-2">What technologies do you use?</h3>
                            <p className="text-gray-600">
                                We primarily use the Llama 3.2 Vision model via the Groq API for image analysis, with a FastAPI backend and React frontend. The entire stack is designed to be lightweight yet powerful.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Is this a commercial product?</h3>
                            <p className="text-gray-600">
                                This is currently a graduate research project at UC Irvine with potential for future commercial applications. I'm happy to discuss academic collaborations or custom implementations.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">How can I get access to the API?</h3>
                            <p className="text-gray-600">
                                The API is currently in limited testing. If you're interested in accessing it for research or development purposes, please contact me at traxlertechnology@gmail.com with details about your use case.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Are you looking for collaborators?</h3>
                            <p className="text-gray-600">
                                Yes! I'm always interested in connecting with other researchers, developers, or organizations working in AI, computer vision, or related fields. Feel free to reach out to discuss potential collaborations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Response Time */}
                <div className="mt-8 bg-blue-50 p-6 rounded-lg text-center">
                    <p className="text-gray-700">
                        <span className="font-medium">Response time:</span> I typically respond to inquiries within 24-48 hours. For urgent matters, please indicate this in your subject line.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Contact;