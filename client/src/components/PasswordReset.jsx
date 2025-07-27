import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SERVER_URL } from '../api_endpoints';

const PasswordReset = () => {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isInvalidToken, setIsInvalidToken] = useState(false);
    const [processState, setProcessState] = useState('PENDING');

    const [token, setToken] = useState(searchParams.get('token'));

    function passwordValid(password) {
        return password.length >= 8 && password.length <= 20;
    }

    useEffect(() => {
        if (!token) return;

        fetch(`${SERVER_URL}/check-recovery-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        })
            .then(res => {
                if (res.status !== 200) {
                    setIsInvalidToken(true);
                    throw new Error('Invalid recovery token');
                }
            })
            .catch(console.error);
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessState('SENDING');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            setSuccess('');
            setProcessState('DONE');
            return;
        }

        if (!passwordValid(newPassword)) {
            alert("Password must be between 8 to 20 characters.");
            setProcessState('DONE');
            return;
        }

        const res = await fetch(`${SERVER_URL}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword }),
        });

        const jsonData = await res.json();

        if (res.status !== 200) {
            setSuccess('');
            setError(`Something went wrong. ${jsonData.error}`);
        } else {
            setError('');
            setSuccess('Password changed successfully! You can now log in.');
            setNewPassword('');
            setConfirmPassword('');
        }

        setProcessState('DONE');
    };

    if (!token || token === '') {
        return <div className="text-center text-xl text-red-600 mt-20">Reset token not found.</div>;
    }

    if (isInvalidToken) {
        return <div className="text-center text-xl text-red-600 mt-20">Invalid or expired token.</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Reset Your Password</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm animate-pulse">{error}</p>}
                    {success && <p className="text-green-600 text-sm animate-fadeIn">{success}</p>}

                    <button
                        type="submit"
                        disabled={processState === 'SENDING'}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {processState === 'SENDING' ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;
