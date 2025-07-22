import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SERVER_URL } from '../api_endpoints';

const SignUp = () => {
    const navigate = useNavigate();

    // Length  <= 10
    // Only letters, numbers and underscore
    // No Spaces
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
            alert("Invalid username. Username must be less than 10 letters and only letters, numbers and underscores are allowed.");
            return;
        }
        if (!passwordValid(data.password)) {
            alert("Invalid password. Password must be atleast 8 letters and atmost 15 letters.");
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

            if (response.status != 200) {
                alert(result.error);
            } else {
                // Success
                navigate("/login");
            }
        } catch (err) {
            alert(err);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md w-full max-w-sm" onSubmit={onFormSubmit}>
                <h2 className="text-2xl font-bold text-center mb-1">Sign Up</h2>
                <p className='text-center mb-4'>Or <Link to='/login' className='underline'>login</Link> instead</p>

                <label className="block mb-2">
                    <span className="text-gray-700">Email</span>
                    <input
                        type="email"
                        name='email'
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded placeholder-gray-400"
                        placeholder="you@example.com"
                        required
                    />
                </label>

                <label className="block mb-2">
                    <span className="text-gray-700">Username</span>
                    <input
                        type="text"
                        name='username'
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded placeholder-gray-400"
                        placeholder="yourusername"
                        required
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-gray-700">Password</span>
                    <input
                        type="password"
                        name='password'
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded placeholder-gray-400"
                        placeholder="********"
                        required
                    />
                </label>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export default SignUp