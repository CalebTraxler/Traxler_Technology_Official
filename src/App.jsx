import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider } from "@auth0/auth0-react";
import { auth0Config } from "./auth0-config";
import ProtectedRoute from "./components/ProtectedRoute";
import WebcamCapture from "./components/WebcamCapture";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Solutions from "./components/Solutions";
import AboutUs from "./components/AboutUs";
import Contact from "./components/Contact";

const App = () => {
    return (
        <Auth0Provider
            domain={auth0Config.domain}
            clientId={auth0Config.clientId}
            authorizationParams={{
                redirect_uri: window.location.origin
            }}
        >
            <Router>
                <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <WebcamCapture />
                            </ProtectedRoute>
                        } />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/solutions" element={<Solutions />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <div className="p-8 max-w-4xl mx-auto"><h1 className="text-2xl font-bold mb-4">Your Profile</h1><p>Profile page content will go here.</p></div>
                            </ProtectedRoute>
                        } />
                        <Route path="/settings" element={
                            <ProtectedRoute>
                                <div className="p-8 max-w-4xl mx-auto"><h1 className="text-2xl font-bold mb-4">Settings</h1><p>Settings page content will go here.</p></div>
                            </ProtectedRoute>
                        } />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </Auth0Provider>
    );
};

export default App;
