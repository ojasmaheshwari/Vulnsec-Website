import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../api_endpoints';
import Loader from './Loader';

const AllWriteUps = () => {
    const [writeUps, setWriteUps] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${SERVER_URL}/writeups`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => {
                if (res.status !== 200) {
                    alert('Unable to fetch writeups');
                    throw new Error('Unable to fetch writeups');
                }
                return res.json();
            })
            .then((jsonData) => setWriteUps(jsonData.data))
            .catch((e) => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6 sm:px-12">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
                ✍️ All Writeups
            </h1>

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {writeUps.map((w, idx) => (
                    <div
                        key={idx}
                        onClick={() => navigate(`./${w.writeUpUuid}`)}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    >
                        <img
                            src={w.thumbnail_url || "https://via.placeholder.com/400x200?text=No+Image"}
                            alt={w.title}
                            className="w-full h-48 object-cover rounded-t-2xl"
                        />
                        <div className="p-5">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{w.title}</h2>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                {w.description}
                            </p>
                            <div className="text-sm text-gray-500">
                                By <span className="font-medium text-indigo-600">{w.authorUsername}</span> ·{' '}
                                {formatDate(w.updated_at)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllWriteUps;
