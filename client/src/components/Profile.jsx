import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLoadingContext from '../contexts/userLoadingContext';
import UserContext from '../contexts/userContext';
import Loader from './Loader';
import { SERVER_URL } from '../api_endpoints';

const defaultProfilePic = "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h2>

                <div className="flex justify-center mb-6">
                    <img
                        src={profile.profilePictureLink || defaultProfilePic}
                        onError={(e) => e.target.src = defaultProfilePic}
                        alt="Profile"
                        className="w-28 h-28 rounded-full border-2 border-gray-300 object-cover"
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Username</label>
                        <input
                            type="text"
                            value={profile.username || ""}
                            readOnly
                            className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
                        />
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={profile.fullName || ""}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* About */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">About</label>
                        <textarea
                            name="about"
                            value={profile.about || ""}
                            onChange={handleChange}
                            rows={3}
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                        />
                    </div>

                    {/* Email Verified */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email Verified</label>
                        <input
                            type="text"
                            value={profile.emailVerified ? 'Yes' : 'No'}
                            readOnly
                            className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
                        />
                    </div>

                    {/* Profile Picture Link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Profile Picture URL</label>
                        <input
                            type="text"
                            name="profilePictureLink"
                            value={profile.profilePictureLink || ""}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
