import React, { useState, useEffect } from 'react'
import { SERVER_URL } from '../api_endpoints';

import { defaultProfilePic } from '../components/Profile';

const useWriteup = (uuid) => {
    const [content, setContent] = useState(null);
    const [meta, setMeta] = useState({ title: '', description: '', posted_by: '', updated_at: '', thumbnail_url: '' });
    const [loading, setLoading] = useState(true)
    const [found, setFound] = useState(false);

    if (!uuid) {
        console.error("UUID not provided in useWriteup hook")
    }

    useEffect(() => {
        fetch(`${SERVER_URL}/writeups/${uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (res.status === 404) {
                    setLoading(false);
                    return; // Writeup not found
                }
                else if (res.status !== 200) {
                    alert("Something went wrong. Please try again later");
                    return;
                }
                return res.json();
            })
            .then(jsonResponse => {
                const { data } = jsonResponse;
                const jsonContent = JSON.parse(data.content);
                setContent(jsonContent);

                setMeta({
                    title: data.title || 'Untitled',
                    description: data.description || '',
                    posted_by: data.authorId.username || 'Unknown',
                    updatedAt: new Date(data.updatedAt).toLocaleString() || '',
                    profile_pic: data.profilePictureLink || defaultProfilePic,
                    thumbnail_url: data.thumbnail_url
                });

                setFound(true)

            })
            .catch(e => console.error(e))
            .finally(() => setLoading(false))
    }, [])


    return { content, meta, loading, found };
}

export default useWriteup