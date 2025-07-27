import React, { useState } from 'react';
import { SERVER_URL } from '../api_endpoints';
import { MailCheck, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [emailSent, setEmailSent] = useState('NOT_SENT');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailSent('SENDING');

        try {
            const res = await fetch(`${SERVER_URL}/send-recovery-mail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const jsonData = await res.json();
            if (res.status !== 200) {
                setMessage(`❌ ${jsonData.error}`);
            } else {
                setMessage(`✅ Recovery email sent to ${email}`);
            }
        } catch (err) {
            setMessage(`❌ An unexpected error occurred.`);
        }

        setEmailSent('DONE');
        setEmail('');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
                <div className="flex flex-col items-center">
                    <MailCheck className="text-blue-500 mb-2" size={40} />
                    <h2 className="text-3xl font-bold text-gray-800 mb-1">Forgot Password</h2>
                    <p className="text-sm text-gray-500 text-center mb-6">Enter your email to receive a recovery link.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={emailSent === 'SENDING'}
                    >
                        {emailSent === 'SENDING' ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Sending...
                            </>
                        ) : (
                            'Send Recovery Email'
                        )}
                    </button>
                </form>

                {message && (
                    <div className="mt-5 text-sm text-center text-gray-700 bg-gray-100 p-2 rounded-md border border-gray-200">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
