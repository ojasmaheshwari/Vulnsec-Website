import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../api_endpoints';
import UserContext from '../contexts/userContext';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(prev => !prev);

    async function onFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const req = await fetch(`${SERVER_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const response = await req.json();

            if (req.status !== 200) {
                alert(response.error);
            } else {
                setUser(response.user);
                if (!response.user.emailVerified) {
                    navigate('/verify-email');
                } else {
                    alert('Logged in!');
                }
            }
        } catch (e) {
            alert('Something went wrong. Please try again.');
        }
    }

    return (
        <div className="min-h-screen bg-black text-green-400 flex items-center justify-center px-4 font-mono relative overflow-hidden">
            {/* Optional animated matrix effect */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="w-full h-full animate-pulse bg-[radial-gradient(#0f0_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
            </div>

            <form
                onSubmit={onFormSubmit}
                className="relative z-10 w-full max-w-md bg-black/70 border border-green-600 rounded-xl shadow-[0_0_30px_#00ff00aa] p-8 space-y-6"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-green-400 tracking-widest">LOGIN PORTAL</h2>
                    <p className="text-green-500 text-sm mt-1">
                        No account?{' '}
                        <Link to="/sign-up" className="text-green-300 underline hover:text-green-100">
                            Sign Up
                        </Link>
                    </p>
                </div>

                <div>
                    <label className="block text-sm text-green-300 mb-1">Username</label>
                    <div className="flex items-center border border-green-600 rounded px-3 py-2 bg-black shadow-inner">
                        <User className="w-5 h-5 text-green-500 mr-2" />
                        <input
                            type="text"
                            name="username"
                            required
                            placeholder="h4ck3r"
                            className="w-full bg-transparent outline-none placeholder-green-500 text-sm text-green-200"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-green-300 mb-1">Password</label>
                    <div className="flex items-center border border-green-600 rounded px-3 py-2 bg-black relative shadow-inner">
                        <Lock className="w-5 h-5 text-green-500 mr-2" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-transparent outline-none placeholder-green-500 text-sm text-green-200 pr-10"
                        />
                        <button
                            type="button"
                            onClick={togglePassword}
                            className="absolute right-3 text-green-400 hover:text-green-200 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="text-right">
                    <Link to="/forgot-password" className="text-sm text-green-400 underline hover:text-green-200">
                        Forgot Password?
                    </Link>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-500 text-black py-2 rounded font-bold transition-all shadow-lg"
                >
                    ENTER SYSTEM
                </button>
            </form>
        </div>
    );
};

export default Login;
