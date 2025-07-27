import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import UserContext from '../contexts/userContext';

const Navbar = () => {
    const { user } = useContext(UserContext);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="w-full fixed top-0 z-50 bg-black bg-opacity-90 border-b border-green-400 text-green-300 shadow-[0_0_10px_#00ff9c] font-mono hacker-bg">
            <div className="flex justify-between items-center h-20 px-6">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl md:text-3xl font-bold text-green-400 hover:text-green-300 transition-all duration-300 tracking-widest glow-text flex items-center gap-2"
                >
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-8 h-8"
                    />
                    VulnSec
                </Link>

                {/* Hamburger */}
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? (
                            <FaTimes className="text-2xl text-green-300" />
                        ) : (
                            <FaBars className="text-2xl text-green-300" />
                        )}
                    </button>
                </div>

                {/* Desktop Nav */}
                <ul className="hidden md:flex items-center gap-6 text-lg">
                    {user ? (
                        <li className="flex items-center gap-2">
                            <FaUserCircle className="text-2xl text-green-400" />
                            <Link to='/profile' className="hover:underline">{user.username}</Link>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded border border-green-400 hover:bg-green-500 hover:text-black transition duration-200"
                                >
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/sign-up"
                                    className="px-4 py-2 rounded border border-white text-white hover:bg-white hover:text-black transition duration-200"
                                >
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <ul className="md:hidden flex flex-col gap-4 px-6 pb-4 text-green-300 text-lg animate-slide-down">
                    {user ? (
                        <li className="flex items-center gap-2">
                            <FaUserCircle className="text-2xl text-green-400" />
                            <Link to="/profile" onClick={() => setMenuOpen(false)}>{user.username}</Link>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link
                                    to="/login"
                                    className="block px-4 py-2 rounded border border-green-400 hover:bg-green-500 hover:text-black transition duration-200"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/sign-up"
                                    className="block px-4 py-2 rounded border border-white text-white hover:bg-white hover:text-black transition duration-200"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Navbar;
