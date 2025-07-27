import React, { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../contexts/userContext';
import { LogIn, FileText, MessageSquare, PlusCircle } from 'lucide-react';

const Home = () => {
    const { user } = useContext(UserContext);
    const canvasRef = useRef();

    // Matrix animation
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const characters = 'アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const columns = canvas.width / 20;
        const drops = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0';
            ctx.font = '16px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * 20, drops[i] * 20);

                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full min-h-screen bg-black text-green-400 font-mono flex items-center justify-center overflow-hidden">
            {/* Animated matrix background */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

            {/* Foreground content */}
            <div className="relative z-10 border border-green-500/30 rounded-xl p-8 backdrop-blur-md bg-black/70 shadow-lg max-w-lg w-full mx-4">
                <div className="text-center mb-8">
                    {/* Hacker Logo */}
                    <img
                        src="/logo.png"
                        alt="Hacker Logo"
                        className="mx-auto mb-4 w-16 h-16"
                    />
                    <h1 className="text-4xl md:text-5xl font-bold text-green-400 drop-shadow-md tracking-widest">VulnSec</h1>
                    <p className="text-sm md:text-base text-green-300 mt-2">
                        Hackers leveling up through CTFs & Bug Bounties
                    </p>
                </div>

                <h2 className="text-lg md:text-xl font-semibold mb-4 border-b border-green-500 pb-1">
                    &gt; Common Actions
                </h2>
                <ul className="space-y-4 pl-2">
                    <li className="flex items-center space-x-3">
                        <LogIn size={18} className="text-green-500" />
                        <Link to="/login" className="hover:underline hover:text-green-300 transition-all">Login</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FileText size={18} className="text-green-500" />
                        <Link to="/writeups" className="hover:underline hover:text-green-300 transition-all">Blogs / Write-Ups</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <MessageSquare size={18} className="text-green-500" />
                        <Link to="/chat" className="hover:underline hover:text-green-300 transition-all">Chatrooms</Link>
                    </li>
                    {user && (user.roles.includes('ROLE_VULNSEC_MEMBER') || user.roles.includes('ROLE_ADMIN')) && (
                        <li className="flex items-center space-x-3">
                            <PlusCircle size={18} className="text-green-500" />
                            <Link to="/create-writeup" className="hover:underline hover:text-green-300 transition-all">Create Writeups</Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Home;
