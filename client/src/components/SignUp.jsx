import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../api_endpoints';
import { Eye, EyeOff } from 'lucide-react';

const SignUp = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    function usernameValid(username) {
        const validPattern = /^[a-zA-Z0-9_]{1,10}$/;
        return validPattern.test(username);
    }

    function passwordValid(password) {
        return password.length >= 8 && password.length <= 20;
    }

    async function onFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!usernameValid(data.username)) {
            alert("Username must be ≤10 characters with only letters, numbers or underscores.");
            return;
        }

        if (!passwordValid(data.password)) {
            alert("Password must be between 8–20 characters.");
            return;
        }

        try {
            const response = await fetch(`${SERVER_URL}/sign-up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const result = await response.json();

            if (response.status !== 200) {
                alert(result.error);
            } else {
                navigate("/login");
            }
        } catch (err) {
            alert("An error occurred. Please try again.");
        }
    }

    return (
        <div className="min-h-screen bg-black text-green-400 flex items-center justify-center px-4 font-mono relative overflow-hidden">
            {/* Matrix-style background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="w-full h-full animate-pulse bg-[radial-gradient(#0f0_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
            </div>

            <form
                onSubmit={onFormSubmit}
                className="relative z-10 bg-black/70 border border-green-600 shadow-[0_0_30px_#00ff00aa] rounded-xl w-full max-w-sm p-8 space-y-6"
            >
                <h2 className="text-3xl font-bold text-center text-green-400 tracking-widest">
                    CREATE ACCOUNT
                </h2>
                <p className="text-center text-green-500 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-green-300 underline hover:text-green-100">
                        Login
                    </Link>
                </p>

                <div>
                    <label className="block text-sm text-green-300 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="you@example.com"
                        className="w-full px-4 py-2 border border-green-600 rounded bg-black text-green-200 placeholder-green-500 outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>

                <div>
                    <label className="block text-sm text-green-300 mb-1">Username</label>
                    <input
                        type="text"
                        name="username"
                        required
                        placeholder="yourusername"
                        className="w-full px-4 py-2 border border-green-600 rounded bg-black text-green-200 placeholder-green-500 outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>

                <div>
                    <label className="block text-sm text-green-300 mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            placeholder="********"
                            className="w-full px-4 py-2 border border-green-600 rounded bg-black text-green-200 placeholder-green-500 outline-none pr-10 focus:ring-2 focus:ring-green-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-200"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-500 text-black py-2 rounded font-bold transition-all shadow-lg"
                >
                    SIGN UP
                </button>
            </form>
        </div>
    );
};

export default SignUp;
