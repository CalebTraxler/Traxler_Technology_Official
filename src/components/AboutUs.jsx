import React from 'react';

const AboutUs = () => {
    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-16">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">About Traxler Technology</h1>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Bringing AI vision capabilities to everyday applications
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Founder Section */}
                <section className="mb-16 bg-white p-8 rounded-xl shadow-md">
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-1">
                            {/* Image placeholder with proper styling for your actual photo */}
                            <div className="rounded-xl overflow-hidden shadow-md">
                                {/* Replace the src attribute with your actual image path when available */}
                                <img
                                    src="src/output.png"
                                    alt="Caleb - Founder of Traxler Technology"
                                    className="w-full h-auto object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/300x300?text=Caleb";
                                    }}
                                />
                            </div>
                            <p className="text-center mt-2 text-sm text-gray-600">Founder, Traxler Technology</p>
                        </div>
                        <div className="md:col-span-2">
                            <h2 className="text-2xl font-bold mb-4">Meet the Founder</h2>
                            <p className="mb-4">
                                Hello! I'm Caleb, a graduate student at the University of California, Irvine, specializing in AI and computer vision. Traxler Technology represents my vision to make powerful AI tools accessible and practical for everyday use.
                            </p>
                            <p className="mb-4">
                                Passionate about computer vision and multimodal systems. Currently building memory-augmented life analyzers and autonomous systems using LLaMA models. Interested in CS PhD programs focused on AI and large-scale inference.
                            </p>
                            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                <h3 className="font-bold text-md mb-2">Education</h3>
                                <div className="mb-2">
                                    <div className="font-medium">University of California, Los Angeles (UCLA)</div>
                                    <div className="text-sm text-gray-600">B.S. in Mathematics and Computer Science</div>
                                </div>
                                <div>
                                    <div className="font-medium">University of California, Irvine (UCI)</div>
                                    <div className="text-sm text-gray-600">Graduate Studies in Data Science</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 mt-6">
                                <a href="https://github.com/CalebTraxler" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                                    </svg>
                                </a>
                                <a href="https://www.linkedin.com/in/calebtraxler/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                                    </svg>
                                </a>
                                <a href="mailto:traxlertechnology@gmail.com" className="text-gray-600 hover:text-blue-600 transition">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vision and Mission */}
                <section className="mb-16 grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                        <p className="text-gray-600">
                            To democratize access to advanced AI vision technology, making it accessible for developers, students, and researchers to build innovative applications that enhance how we interact with visual information.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Mission</h2>
                        <p className="text-gray-600">
                            To create simple yet powerful AI vision tools that solve real problems, while contributing to the academic community through research and open collaboration.
                        </p>
                    </div>
                </section>

                {/* Journey Timeline */}
                <section className="mb-16 bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">The Journey</h2>
                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-0 md:left-1/2 transform md:translateX-[-50%] h-full w-1 bg-blue-200"></div>

                        {/* Timeline items */}
                        <div className="ml-8 md:ml-0">
                            {/* Item 1 */}
                            <div className="relative flex md:flex-row-reverse flex-col md:justify-between items-start mb-16">
                                <div className="w-full md:w-5/12 md:pl-8 md:text-right">
                                    <h3 className="font-bold text-lg mb-1">Project Inception</h3>
                                    <p className="text-sm text-gray-500 mb-2">2024</p>
                                    <p className="text-gray-600">
                                        Started as a research project at UC Irvine, exploring the potential of large vision models for accessible applications.
                                    </p>
                                </div>
                                <div className="absolute left-[-25px] md:left-1/2 transform md:translate-x-[-50%] w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                </div>
                                <div className="w-full md:w-5/12 md:pr-8 hidden md:block"></div>
                            </div>

                            {/* Item 2 */}
                            <div className="relative flex md:justify-between items-start mb-16">
                                <div className="w-full md:w-5/12 md:pr-8">
                                    <h3 className="font-bold text-lg mb-1">First Prototype</h3>
                                    <p className="text-sm text-gray-500 mb-2">2025</p>
                                    <p className="text-gray-600">
                                        Developed the initial webcam-based analysis tool integrating with the Llama 3.2 Vision model through the Groq API.
                                    </p>
                                </div>
                                <div className="absolute left-[-25px] md:left-1/2 transform md:translate-x-[-50%] w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path>
                                    </svg>
                                </div>
                                <div className="w-full md:w-5/12 md:pl-8 hidden md:block"></div>
                            </div>

                            {/* Item 3 */}
                            <div className="relative flex md:flex-row-reverse flex-col md:justify-between items-start">
                                <div className="w-full md:w-5/12 md:pl-8 md:text-right">
                                    <h3 className="font-bold text-lg mb-1">Looking Forward</h3>
                                    <p className="text-sm text-gray-500 mb-2">Future</p>
                                    <p className="text-gray-600">
                                        Continuing to develop memory-augmented life analyzers and autonomous systems while pursuing CS PhD programs focused on AI and large-scale inference.
                                    </p>
                                </div>
                                <div className="absolute left-[-25px] md:left-1/2 transform md:translate-x-[-50%] w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <div className="w-full md:w-5/12 md:pr-8 hidden md:block"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Academic Background */}
                <section className="mb-16 bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Academic Foundation</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex space-x-4 mb-4">
                                <img src="/src/ucla_logo.png" alt="UCLA Logo" className="h-16 w-auto" />
                                <img src="/src/uci_logo.jpg" alt="UC Irvine Logo" className="h-16 w-auto" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Educational Background</h3>
                            <div className="mb-4">
                                <div className="font-medium">University of California, Los Angeles (UCLA)</div>
                                <div className="text-gray-600 mb-2">B.S. in Mathematics and Computer Science</div>
                            </div>
                            <div className="mb-4">
                                <div className="font-medium">University of California, Irvine (UCI)</div>
                                <div className="text-gray-600">Graduate Studies in Data Science</div>
                            </div>
                            <p className="text-gray-600">
                                The academic environment at these institutions provides valuable resources, mentorship, and a collaborative community that helps drive this project forward.
                            </p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h3 className="font-bold text-lg mb-3">Research Interests</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>Computer Vision & Multimodal Systems</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>Memory-Augmented Life Analyzers</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>Autonomous Systems & LLaMA Models</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>Large-Scale Inference & AI Systems</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;
