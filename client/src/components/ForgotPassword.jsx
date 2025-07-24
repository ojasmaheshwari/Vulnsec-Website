import React from 'react'
import { useState } from 'react';
import { SERVER_URL } from '../api_endpoints';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [emailSent, setEmailSent] = useState('NOT_SENT')

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailSent('SENDING')

        const res = await fetch(`${SERVER_URL}/send-recovery-mail`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        setEmailSent('DONE')
        const jsonData = await res.json();

        if (res.status !== 200) {
            setMessage(`An error occured: ${jsonData.error}`)
        } else {
            setMessage(`Recovery email sent to ${email}`);
        }

        setEmail("")
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-progress"
                        disabled={emailSent === "SENDING"}
                    >
                        Send Recovery Email
                    </button>
                </form>
                {message && <p className="mt-4 text-sm text-center">{message}</p>}
            </div>
        </div>
    )
}

export default ForgotPassword