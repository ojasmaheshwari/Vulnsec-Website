import React from 'react'
import { useState, useContext } from 'react';
import UserLoadingContext from '../contexts/userLoadingContext';
import UserContext from '../contexts/userContext';
import Loader from './Loader';
import { useEffect } from 'react';
import { SERVER_URL } from '../api_endpoints';
import { useNavigate } from 'react-router-dom';

const defaultProfilePic = "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";

const Profile = () => {
    const { userLoading, setUserLoading } = useContext(UserLoadingContext);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [profile, setProfile] = useState({});

    useEffect(() => {
        if (userLoading) return;

        setProfile(user);
    }, [userLoading])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries())

        const res = await fetch(`${SERVER_URL}/user`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        const jsonData = await res.json()
        if (res.status !== 200) {
            alert(jsonData.error);
        } else {
            setUser(jsonData.user)
            alert(jsonData.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (userLoading) {
        return <Loader />;
    }

    if (!user) {
        navigate("/login");
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username - Readonly */}
                <div>
                    <label className="block text-sm font-medium">Username</label>
                    <input
                        type="text"
                        value={profile.username || ""}
                        readOnly
                        className="mt-1 w-full px-3 py-2 border rounded bg-gray-100 text-gray-600"
                    />
                </div>

                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={profile.fullName || ""}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border rounded"
                    />
                </div>

                {/* About */}
                <div>
                    <label className="block text-sm font-medium">About</label>
                    <textarea
                        name="about"
                        value={profile.about || ""}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border rounded"
                        rows={3}
                    />
                </div>

                {/* Email Verified - Readonly */}
                <div>
                    <label className="block text-sm font-medium">Email Verified</label>
                    <input
                        type="text"
                        value={profile.emailVerified ? 'Yes' : 'No'}
                        readOnly
                        className="mt-1 w-full px-3 py-2 border rounded bg-gray-100 text-gray-600"
                    />
                </div>

                {/* Profile Picture Link */}
                <div>
                    <label className="block text-sm font-medium">Profile Picture Link</label>
                    <input
                        type="text"
                        name="profilePictureLink"
                        value={profile.profilePictureLink || ""}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border rounded"
                    />
                </div>

                {/* Image Preview */}

                <div className="mt-2">
                    <img
                        src={profile.profilePictureLink || defaultProfilePic}
                        alt="Profile preview"
                        className="w-full h-32 object-center rounded border"
                        onError={(e) => {
                            e.target.src = defaultProfilePic; // Remove broken image if not valid
                        }}
                    />
                </div>


                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Profile