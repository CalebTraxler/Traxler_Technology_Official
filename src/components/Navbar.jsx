import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth0();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    return (
        <header className="bg-blue-900 text-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Link to="/" className="flex items-center space-x-2">
                            <img src="public/logo.png" alt="Traxler Technology Logo" className="h-8 w-auto" />
                            <span className="font-bold text-2xl tracking-tight">Traxler Technology</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-6">
                        <Link to="/" className="px-3 py-2 text-sm font-medium hover:text-blue-300 transition">
                            Vision AI
                        </Link>
                        <Link to="/solutions" className="px-3 py-2 text-sm font-medium hover:text-blue-300 transition">
                            Solutions
                        </Link>
                        <Link to="/about" className="px-3 py-2 text-sm font-medium hover:text-blue-300 transition">
                            About Us
                        </Link>
                        <Link to="/contact" className="px-3 py-2 text-sm font-medium hover:text-blue-300 transition">
                            Contact
                        </Link>
                    </nav>

                    {/* User Account */}
                    <div className="hidden md:flex items-center space-x-2">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={toggleProfile}
                                    className="flex items-center space-x-2 focus:outline-none"
                                    aria-expanded={isProfileOpen}
                                    aria-haspopup="true"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                                        {user?.picture ? (
                                            <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <span className="text-sm font-medium">{user?.name?.charAt(0) || 'U'}</span>
                                        )}
                                    </div>
                                    <span className="text-sm font-medium hidden lg:block">
                                        {user?.name || 'User'}
                                    </span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 text-gray-800">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() => logout({ returnTo: window.location.origin })}
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition text-red-600"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded shadow"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden focus:outline-none"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="mt-4 md:hidden pb-4">
                        <nav className="flex flex-col space-y-2">
                            <Link to="/" className="px-3 py-2 text-sm font-medium hover:bg-blue-800 rounded" onClick={() => setIsMenuOpen(false)}>
                                Vision AI
                            </Link>
                            <Link to="/solutions" className="px-3 py-2 text-sm font-medium hover:bg-blue-800 rounded" onClick={() => setIsMenuOpen(false)}>
                                Solutions
                            </Link>
                            <Link to="/about" className="px-3 py-2 text-sm font-medium hover:bg-blue-800 rounded" onClick={() => setIsMenuOpen(false)}>
                                About Us
                            </Link>
                            <Link to="/contact" className="px-3 py-2 text-sm font-medium hover:bg-blue-800 rounded" onClick={() => setIsMenuOpen(false)}>
                                Contact
                            </Link>

                            {/* Mobile User Menu */}
                            {isAuthenticated ? (
                                <>
                                    <hr className="border-blue-800 my-2" />
                                    <div className="px-3 py-2 text-sm font-medium">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                                                {user?.picture ? (
                                                    <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
                                                ) : (
                                                    <span>{user?.name?.charAt(0) || 'U'}</span>
                                                )}
                                            </div>
                                            <span>{user?.name || 'User'}</span>
                                        </div>
                                        <Link to="/profile" className="block py-2 hover:bg-blue-800 rounded px-2" onClick={() => setIsMenuOpen(false)}>
                                            Profile
                                        </Link>
                                        <Link to="/settings" className="block py-2 hover:bg-blue-800 rounded px-2" onClick={() => setIsMenuOpen(false)}>
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                logout({ returnTo: window.location.origin });
                                            }}
                                            className="block w-full text-left py-2 hover:bg-blue-800 rounded px-2 text-red-300"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <hr className="border-blue-800 my-2" />
                                    <Link
                                        to="/login"
                                        className="mx-3 bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded text-center"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
