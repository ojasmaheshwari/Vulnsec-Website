import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLoadingContext from '../contexts/userLoadingContext';
import UserContext from '../contexts/userContext';
import Loader from './Loader';
import { SERVER_URL } from '../api_endpoints';

export const defaultProfilePic = "https://api.dicebear.com/7.x/identicon/svg?seed=anon";

const Profile = () => {
    const { userLoading } = useContext(UserLoadingContext);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState({});

    useEffect(() => {
        if (!userLoading) {
            setProfile(user);
        }
    }, [userLoading]);

    useEffect(() => {
        if (!userLoading && !user) {
            navigate("/login");
        }
    }, [userLoading, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const res = await fetch(`${SERVER_URL}/user`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        const jsonData = await res.json();
        if (res.status !== 200) {
            alert(jsonData.error);
        } else {
            setUser(jsonData.user);
            alert(jsonData.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    if (userLoading) return <Loader />;

    return (
        <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-xl bg-gray-900/80 border border-green-400 p-6 md:p-8 rounded-xl shadow-lg shadow-green-500/20">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-300 mb-6 text-center tracking-wide">
                    ~ Edit Profile ~
                </h2>

                <div className="flex justify-center mb-6">
                    <img
                        src={profile.profilePictureLink || defaultProfilePic}
                        onError={(e) => e.target.src = defaultProfilePic}
                        alt="Profile"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-green-500 object-cover shadow-md"
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 text-sm sm:text-base">
                    <div>
                        <label className="block text-green-300">Username</label>
                        <input
                            type="text"
                            value={profile.username || ""}
                            readOnly
                            className="w-full mt-1 px-4 py-2 bg-black border border-green-700 rounded-md text-green-500 text-xs sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-green-300">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={profile.fullName || ""}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 bg-black border border-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-green-300">About</label>
                        <textarea
                            name="about"
                            value={profile.about || ""}
                            onChange={handleChange}
                            rows={3}
                            className="w-full mt-1 px-4 py-2 bg-black border border-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-green-300">Email Verified</label>
                        <input
                            type="text"
                            value={profile.emailVerified ? 'Yes' : 'No'}
                            readOnly
                            className="w-full mt-1 px-4 py-2 bg-black border border-green-700 rounded-md text-green-500 text-xs sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-green-300">Profile Picture URL</label>
                        <input
                            type="text"
                            name="profilePictureLink"
                            value={profile.profilePictureLink || ""}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 bg-black border border-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-700 hover:bg-green-600 text-black font-bold py-2 rounded-md transition duration-300 shadow-md shadow-green-500/30 text-sm sm:text-base"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
