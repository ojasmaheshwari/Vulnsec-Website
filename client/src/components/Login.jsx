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
        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center px-4">
            <form
                onSubmit={onFormSubmit}
                className="w-full max-w-md bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Don’t have an account?{' '}
                        <Link to="/sign-up" className="text-blue-600 hover:underline font-medium">
                            Sign Up
                        </Link>
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition">
                        <User className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            name="username"
                            required
                            placeholder="yourusername"
                            className="w-full bg-transparent outline-none placeholder-gray-400 text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-400 relative transition">
                        <Lock className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-transparent outline-none placeholder-gray-400 text-sm pr-10"
                        />
                        <button
                            type="button"
                            onClick={togglePassword}
                            className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="text-right">
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                        Forgot Password?
                    </Link>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md"
                >
                    Log In
                </button>
            </form>
        </div>
    );
};

export default Login;
