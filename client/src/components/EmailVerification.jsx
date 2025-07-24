import React, { useState } from 'react'
import UserContext from '../contexts/userContext'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UserLoadingContext from '../contexts/userLoadingContext'
import { SERVER_URL } from '../api_endpoints'
import Loader from './Loader'

const EmailVerification = () => {
    const { userLoading } = useContext(UserLoadingContext)
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
            if (res.status === 200) {
                setSuccess(true);
            }
            return res.json()
        }).catch((err) => console.error(err)).finally(() => setSendingEmail(false))

    }, [userLoading]);

    if (userLoading) {
        return <Loader />;
    }
    if (!user) {
        return <h1>Redirecting to /login</h1>
    }

    if (sendingEmail) {
        return <Loader />
    }

    return (
        <>
            {success ? <div className='min-h-screen flex justify-center items-center flex-col'>
                <div className='-translate-y-18'>
                    <h1 className='text-2xl text-center my-2'>Verify your email address</h1>
                    <h2 className='text-xl text-center'>An email has been sent to <b>{user.email}</b>, please click on the link given in email to verify your account.</h2>
                </div>

            </div> : <div className='-translate-y-18'>
                <h1 className='text-2xl text-center my-2'>Error</h1>
                <h2 className='text-xl text-center'>Something went wrong, please try again later</h2>
            </div>}
        </>
    )
}

export default EmailVerification