import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../contexts/userContext';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const { user } = useContext(UserContext);

    return (
        <div className="w-full h-20 px-6 bg-black bg-opacity-80 border-b border-green-400 shadow-[0_0_10px_#00ff9c] flex items-center justify-between font-mono hacker-bg">
            {/* Logo */}
            <Link
                to="/"
                className="text-3xl font-bold text-green-400 hover:text-green-300 transition-all duration-300 tracking-widest glow-text"
            >
                <img
                    src="/logo.png"
                    alt="Hacker Logo"
                    className="w-8 h-8 inline-block mr-2"
                />
                VulnSec
            </Link>

            {/* Nav Items */}
            <ul className="flex items-center gap-6 text-green-300 text-lg">
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
                                className="px-4 py-2 rounded border border-green-400 hover:bg-green-500 hover:text-black transition-all duration-200"
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/sign-up"
                                className="px-4 py-2 rounded border border-white text-white hover:bg-white hover:text-black transition-all duration-200"
                            >
                                Sign Up
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Navbar;
