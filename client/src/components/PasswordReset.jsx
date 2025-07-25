import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SERVER_URL } from '../api_endpoints';

const PasswordReset = () => {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isInvalidToken, setIsInvalidToken] = useState(false)
    const [processState, setProcessState] = useState("PENDING")

    const [token, setToken] = useState(searchParams.get('token'))

    function passwordValid(password) {
        return password.length >= 8 && password.length <= 20;
    }

    useEffect(() => {
        if (!token) return;

        fetch(`${SERVER_URL}/check-recovery-token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            }
        )
            .then(res => {
                if (res.status !== 200) {
                    setIsInvalidToken(true);
                    throw new Error("Invalid recovery token")
                }
            })
            .catch(err => {
                console.error(err)
            })
    }, [token])

    const handleSubmit = async (e) => {
        e.preventDefault();

        setProcessState("SENDING")

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setSuccess('');
            return;
        }

        if (!passwordValid(newPassword)) {
            alert("Invalid password. Password must be atleast 8 letters and atmost 15 letters.")
            return;
        }

        // TODO: Call API to update password using a reset token from URL
        const res = await fetch(`${SERVER_URL}/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword }),
        })
        const jsonData = await res.json();

        if (res.status !== 200) {
            setSuccess("");
            setError(`Something went wrong. ${jsonData.error}`)
        } else {
            setError("");
            setSuccess(`Password changed successfully. You can now login with new password.`)

            setNewPassword("")
            setConfirmPassword("")
        }

        setProcessState("DONE")
    };

    if (!token || token === "") {
        return <h1>Reset token not found</h1>
    }

    if (isInvalidToken) {
        return <h1>Invalid token</h1>
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">New Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-md"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Confirm Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-md"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-progress"
                    disabled={processState === "SENDING"}
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
}

export default PasswordReset