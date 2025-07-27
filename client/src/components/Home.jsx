import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../contexts/userContext';
import { LogIn, FileText, MessageSquare, PlusCircle } from 'lucide-react';

const Home = () => {
    const { user } = useContext(UserContext);

    return (
        <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient">
            {/* Background animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 blur-3xl opacity-50 z-0 animate-gradient" />

            {/* Foreground content */}
            <div className="relative z-10 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 text-white">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold mb-3 drop-shadow-md">VulnSec</h1>
                    <p className="text-lg text-white/80">
                        Group of driven individuals getting better at Hacking through CTFs and Bug Bounty
                    </p>
                </div>

                <h2 className="text-xl font-semibold mb-4 text-white">🚀 Common Actions</h2>
                <ul className="space-y-4">
                    <li className="flex items-center space-x-3">
                        <LogIn size={20} className="text-blue-300" />
                        <Link to="/login" className="hover:underline">Login</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FileText size={20} className="text-green-300" />
                        <Link to="/writeups" className="hover:underline">Blogs / Write-Ups</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <MessageSquare size={20} className="text-purple-300" />
                        <Link to="/chat" className="hover:underline">Chatrooms</Link>
                    </li>
                    {user && (user.roles.includes('ROLE_VULNSEC_MEMBER') || user.roles.includes('ROLE_ADMIN')) && (
                        <li className="flex items-center space-x-3">
                            <PlusCircle size={20} className="text-orange-300" />
                            <Link to="/create-writeup" className="hover:underline">Create Writeups</Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Home;
