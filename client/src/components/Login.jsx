import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../api_endpoints';
import UserContext from '../contexts/userContext';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

import { ToastContainer, toast } from 'react-toastify';


const Login = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [submitState, setSubmitState] = useState(true);

    const togglePassword = () => setShowPassword(prev => !prev);

    async function onFormSubmit(e) {
        e.preventDefault();

        setSubmitState(false);

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Show loading toast and store its ID
        const toastId = toast.loading("Logging in...");

        try {
            const req = await fetch(`${SERVER_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const response = await req.json();

            if (req.status !== 200) {
                toast.update(toastId, {
                    render: response.error || "Login failed",
                    type: "error",
                    isLoading: false,
                    autoClose: 4000,
                    closeButton: true
                });
            } else {
                setUser(response.user);

                toast.update(toastId, {
                    render: "Login successful!",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                    closeButton: true
                });

                if (!response.user.emailVerified) {
                    navigate('/verify-email');
                }
            }
        } catch (e) {
            toast.update(toastId, {
                render: "Something went wrong. Please try again.",
                type: "error",
                isLoading: false,
                autoClose: 4000,
                closeButton: true
            });
        }

        setSubmitState(true);
        form.reset();
        setShowPassword(false);
    }

    return (
        <div className="min-h-screen bg-black text-green-400 flex items-center justify-center px-4 font-mono relative overflow-hidden flex-col py-10">
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
                    className="w-full bg-green-600 hover:bg-green-500 text-black py-2 rounded font-bold transition-all shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!submitState}
                >
                    ENTER SYSTEM
                </button>
            </form>
            {/* Login issue note */}
            <p className="mt-4 text-sm text-green-500 text-center">
                Facing login problems? <span className="underline">Try enabling third-party cookies</span> in your browser.
            </p>

            <ToastContainer position="bottom-right" theme="dark" />
        </div>
    );
};

export default Login;
