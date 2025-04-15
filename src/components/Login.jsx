import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <img src="logo.png" alt="Traxler Technology Logo" className="h-16 w-auto" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome to Traxler Technology</h1>
                        <p className="text-gray-600 mt-2">Sign in to access our Vision AI Platform</p>
                    </div>

                    <button
                        onClick={() => loginWithRedirect()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 shadow-md flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd"></path>
                        </svg>
                        Sign in with Auth0
                    </button>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>Secure access to enterprise-grade AI vision tools</p>
                    </div>
                </div>

                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">New to our platform?</span>
                        <button
                            onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            Create an account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
