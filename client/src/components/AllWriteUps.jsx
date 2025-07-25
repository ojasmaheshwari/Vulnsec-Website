import { useNavigate } from 'react-router-dom'
import { SERVER_URL } from '../api_endpoints'
import React, { useState, useEffect } from 'react'
import Loader from './Loader'

const AllWriteUps = () => {
    const [writeUps, setWriteUps] = useState([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${SERVER_URL}/writeups`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (res.status !== 200) {
                    alert("Unable to fetch writeups")
                    throw new Error("Unable to fetch writeups");
                }

                return res.json()
            })
            .then(jsonData => {
                setWriteUps(jsonData.data)
            })
            .catch((e) => console.error(e))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">All Writeups</h1>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {writeUps.map((w, idx) => (
                    <div key={idx} className="max-w-84 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300" onClick={() => navigate(`./${w.writeUpUuid}`)}>
                        <img src={w.thumbnail_url} alt={w.title} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-1">{w.title}</h2>
                            <p className="text-gray-600 text-sm mb-2">{w.description}</p>
                            <div className="text-xs text-gray-500">
                                Posted by <span className="font-medium underline">{w.authorUsername}</span> · {w.updated_at}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllWriteUps