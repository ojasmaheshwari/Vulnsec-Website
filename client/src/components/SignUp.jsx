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
        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center px-4">
            <form onSubmit={onFormSubmit} className="bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl w-full max-w-sm p-8 space-y-5">
                <h2 className="text-3xl font-extrabold text-center text-gray-800">Create Account</h2>
                <p className="text-center text-gray-600 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 font-medium hover:underline">
                        Login
                    </Link>
                </p>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="you@example.com"
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        name="username"
                        required
                        placeholder="yourusername"
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            placeholder="********"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUp;
