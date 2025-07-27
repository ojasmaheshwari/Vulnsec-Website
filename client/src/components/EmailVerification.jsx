import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/userContext';
import UserLoadingContext from '../contexts/userLoadingContext';
import { SERVER_URL } from '../api_endpoints';
import Loader from './Loader';

const EmailVerification = () => {
    const { userLoading } = useContext(UserLoadingContext);
    const { user, setUser } = useContext(UserContext);
    const [sendingEmail, setSendingEmail] = useState(true);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (userLoading) return;

        if (user === null) {
            navigate('/login');
            return;
        } else if (user.emailVerified) {
            navigate('/');
            return;
        }

        fetch(`${SERVER_URL}/verify-email`, {
            method: "POST",
            credentials: "include"
        }).then((res) => {
            if (res.status === 200) setSuccess(true);
            return res.json();
        }).catch((err) => console.error(err))
            .finally(() => setSendingEmail(false));

    }, [userLoading]);

    if (userLoading || sendingEmail) {
        return <Loader />;
    }

    if (!user) {
        return <h1 className="text-green-500 text-center mt-10 text-xl font-mono">Redirecting to /login...</h1>;
    }

    return (
        <div className="min-h-screen bg-black text-green-400 flex items-center justify-center px-4">
            <div className="max-w-3xl border border-green-500 rounded-2xl p-6 bg-[#0a0a0a] shadow-[0_0_15px_2px_#00ff00cc] animate-fade-in">
                {success ? (
                    <>
                        <h1 className="text-3xl font-bold text-center mb-4 font-mono animate-pulse">
                            ✅ Email Sent
                        </h1>
                        <p className="text-xl text-center font-mono leading-relaxed">
                            An email has been sent to <span className="text-white font-bold">{user.email}</span>.<br />
                            Please check your inbox and verify your account.
                            Please check your spam folder if you don't see it in your inbox.
                            The email may take upto 10-15 minutes to arrive.
                            Reload the page to resend the verification email.
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold text-center mb-4 text-red-400 font-mono animate-pulse">
                            ❌ Error
                        </h1>
                        <p className="text-xl text-center font-mono leading-relaxed">
                            Something went wrong. Please try again later.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default EmailVerification;
