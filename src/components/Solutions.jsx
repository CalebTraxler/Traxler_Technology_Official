import React from 'react';

const Solutions = () => {
    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-16">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">AI Solutions</h1>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Innovative vision AI technology built for real-world applications
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Solutions Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <div className="mb-4 text-blue-600">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Image Analysis API</h3>
                        <p className="text-gray-600 mb-4">
                            Access powerful vision AI capabilities through our simple yet flexible API. Perfect for developers and researchers looking to integrate visual analysis into their projects.
                        </p>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span>Real-time image classification</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span>Simple integration with existing apps</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span>Built on Llama 3.2 Vision model</span>
                            </li>
                        </ul>
                        <a href="#" className="text-blue-600 font-medium hover:text-blue-800 transition">
                            API Documentation 
                        </a>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <div className="mb-4 text-blue-600">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Research Collaboration</h3>
                        <p className="text-gray-600 mb-4">
                            As a UCI graduate student project, Traxler Technology welcomes academic and research partnerships to advance the field of computer vision and AI.
                        </p>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span>Joint research opportunities</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span>Academic discount for researchers</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span>Custom model development</span>
                            </li>
                        </ul>
                        <a href="#" className="text-blue-600 font-medium hover:text-blue-800 transition">
                            Contact for research inquiries 
                        </a>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <div className="mb-4 text-blue-600">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Custom Applications</h3>
                        <p className="text-gray-600 mb-4">
                            Need a specialized vision AI solution for your specific use case? I can develop custom applications leveraging the latest in AI technology to solve your unique challenges.
                        </p>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span>Personalized consultation</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span>Tailored solution development</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span>Flexible development options</span>
                            </li>
                        </ul>
                        <a href="#" className="text-blue-600 font-medium hover:text-blue-800 transition">
                            Discuss your project 
                        </a>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <div className="mb-4 text-blue-600">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Educational Resources</h3>
                        <p className="text-gray-600 mb-4">
                            As part of my commitment to the AI community, I provide educational resources to help others learn about computer vision, machine learning, and AI implementation.
                        </p>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span>Tutorials and guides</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span>Code examples and repositories</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span>Academic papers and research</span>
                            </li>
                        </ul>
                        <a href="#" className="text-blue-600 font-medium hover:text-blue-800 transition">
                            Browse resources 
                        </a>
                    </div>
                </div>

                {/* Research Focus Section */}
                <section className="bg-blue-800 text-white p-8 rounded-xl shadow-lg mb-16">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Current Research Focus</h2>
                            <p className="mb-6">
                                As a graduate student at UC Irvine, my research focuses on making advanced vision AI technologies more accessible and practical for everyday applications. Current areas of exploration include:
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>Optimizing large vision models for edge devices</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>Multimodal vision-language systems</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>Improving response quality in vision QA systems</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>Applications in accessibility and assistive technology</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-blue-700 p-6 rounded-lg">
                            <h3 className="font-bold mb-3">Interested in collaborating?</h3>
                            <p className="mb-4">I'm always open to research partnerships, especially with fellow students and faculty at UC Irvine or other institutions.</p>
                            <a href="#" className="inline-block bg-white text-blue-800 px-4 py-2 rounded font-medium hover:bg-blue-50 transition">
                                Contact me about research
                            </a>
                        </div>
                    </div>
                </section>

                {/* Technologies Used */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 text-center">Technologies Used</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-blue-600 font-bold mb-1">Llama 3.2</div>
                            <div className="text-sm text-gray-600">Vision model</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-blue-600 font-bold mb-1">React</div>
                            <div className="text-sm text-gray-600">Frontend</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-blue-600 font-bold mb-1">FastAPI</div>
                            <div className="text-sm text-gray-600">Backend</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-blue-600 font-bold mb-1">Groq</div>
                            <div className="text-sm text-gray-600">API integration</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-blue-600 font-bold mb-1">TensorFlow</div>
                            <div className="text-sm text-gray-600">Research</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-blue-600 font-bold mb-1">PyTorch</div>
                            <div className="text-sm text-gray-600">Research</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-blue-600 font-bold mb-1">Auth0</div>
                            <div className="text-sm text-gray-600">Authentication</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-blue-600 font-bold mb-1">Python</div>
                            <div className="text-sm text-gray-600">Development</div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Solutions;