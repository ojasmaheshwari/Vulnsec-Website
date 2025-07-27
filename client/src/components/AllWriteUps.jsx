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
        <div className="min-h-screen bg-black text-green-400 font-mono px-6 sm:px-12 py-10">
            <h1 className="text-4xl font-bold text-center mb-10 neon-text">[ ALL WRITEUPS ]</h1>

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {writeUps.map((w, idx) => (
                    <div
                        key={idx}
                        onClick={() => navigate(`./${w.writeUpUuid}`)}
                        className="bg-gray-900 border border-green-500/40 rounded-lg overflow-hidden cursor-pointer transform hover:scale-[1.03] transition-all duration-300 hover:shadow-neon"
                    >
                        <img
                            src={w.thumbnail_url || "https://via.placeholder.com/400x200?text=No+Image"}
                            alt={w.title}
                            className="w-full h-48 object-cover opacity-90"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-bold text-green-300 mb-2 glitch-text">{w.title}</h2>
                            <p className="text-green-500 text-sm mb-3 line-clamp-3">
                                {w.description}
                            </p>
                            <div className="text-xs text-green-600">
                                By <span className="text-green-400">{w.authorUsername}</span> · {formatDate(w.updated_at)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>
                {`
                    .neon-text {
                        text-shadow: 0 0 2px #00ff00, 0 0 4px #00ff00;
                    }

                    .glitch-text {
                        position: relative;
                        color: #00ff00;
                    }

                    .glitch-text::before,
                    .glitch-text::after {
                        content: attr(data-text);
                        position: absolute;
                        left: 0;
                        width: 100%;
                        overflow: hidden;
                        color: #00ff00;
                        background: transparent;
                    }

                    .glitch-text::before {
                        top: -1px;
                        text-shadow: 1px 0 red;
                        animation: glitch 2s infinite linear alternate-reverse;
                    }

                    .glitch-text::after {
                        top: 1px;
                        text-shadow: -1px 0 blue;
                        animation: glitch 1.5s infinite linear alternate-reverse;
                    }

                    @keyframes glitch {
                        0% {
                            clip: rect(0, 9999px, 0, 0);
                        }
                        5% {
                            clip: rect(0, 9999px, 100%, 0);
                        }
                        10% {
                            clip: rect(0, 9999px, 50%, 0);
                        }
                        15% {
                            clip: rect(0, 9999px, 80%, 0);
                        }
                        20% {
                            clip: rect(0, 9999px, 0, 0);
                        }
                        100% {
                            clip: rect(0, 9999px, 0, 0);
                        }
                    }

                    .hover\\:shadow-neon:hover {
                        box-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
                    }
                `}
            </style>
        </div>
    );
};

export default AllWriteUps;
