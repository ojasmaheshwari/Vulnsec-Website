import { SERVER_URL } from '/src/api_endpoints';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from './Loader';

const Users = () => {
    const { username } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`${SERVER_URL}/users/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('User not found');
                }
                return response.json();
            })
            .then(data => setData(data.user))
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError('User not found');
            })
            .finally(() => setLoading(false));
    }, [username]);

    if (!username) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono">
                <h1>Username not provided</h1>
            </div>
        );
    }

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono">
                <h1>{error}</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center p-6">
            <img
                src={data.profilePictureLink}
                alt="Profile"
                className="w-32 h-32 rounded-full border-2 border-green-400 mb-4 shadow-md bg-center"
            />
            <div className="bg-green-900/10 border border-green-400 p-4 rounded-xl w-full max-w-md shadow-lg">
                <div className="mb-2">
                    <span className="text-green-300">Username:</span> {data.username}
                </div>
                <div className="mb-2">
                    <span className="text-green-300">Full Name:</span> {data.fullName}
                </div>
                <div>
                    <span className="text-green-300">About:</span> {data.about}
                </div>
                {
                    data.roles.includes('ROLE_VULNSEC_MEMBER') && (
                        <div className='my-4 mx-auto text-center'>
                            <span className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-pink-500 font-semibold">VulnSec Member</span>
                        </div>)
                }

            </div>
        </div>
    );
};

export default Users;
