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
        <div className="flex items-center justify-center min-h-screen bg-black text-green-400 px-4 font-mono relative overflow-hidden">
            {/* Hacker Matrix Effect */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none animate-hacker-bg"></div>

            <div className="relative z-10 bg-[#0f0f0f] border border-green-500 shadow-2xl rounded-xl p-8 w-full max-w-md backdrop-blur-md">
                <div className="flex flex-col items-center">
                    <MailCheck className="text-green-400 mb-2" size={40} />
                    <h2 className="text-3xl font-bold text-green-300 mb-1">Forgot Password</h2>
                    <p className="text-sm text-green-500 text-center mb-6">
                        Enter your email to receive a recovery link.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm mb-1 text-green-400">Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 bg-black border border-green-500 rounded-lg text-green-300 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-green-500 text-black font-semibold py-2.5 rounded-lg hover:bg-green-400 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
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
                    <div className="mt-5 text-sm text-green-300 bg-black p-2 rounded-md border border-green-600">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
