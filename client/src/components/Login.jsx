import React from 'react'
import { Link } from 'react-router-dom'
import { SERVER_URL } from '../api_endpoints';

const Login = () => {

    async function onFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const req = await fetch(`${SERVER_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include'
            })

            const response = await req.json();

            if (req.status != 200) {
                alert(response.error);
            } else {
                alert(response.message);
            }
        } catch (e) {
            alert(e);
        }

    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md w-full max-w-sm" onSubmit={onFormSubmit}>
                <h2 className="text-2xl font-bold text-center mb-1">Log In</h2>
                <p className='text-center mb-4'>Or <Link to='/sign-up' className='underline'>Sign Up</Link> instead</p>

                <label className="block mb-2">
                    <span className="text-gray-700">Username</span>
                    <input
                        type="text"
                        name="username"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded placeholder-gray-400"
                        placeholder="yourusername"
                        required
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-gray-700">Password</span>
                    <input
                        type="password"
                        name="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded placeholder-gray-400"
                        placeholder="********"
                        required
                    />
                </label>

                <label className="block mb-4">
                    <Link to="/forgot-password" className='underline'>Forgot Password?</Link>
                </label>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login