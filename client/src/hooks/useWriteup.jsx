import React, { useState, useEffect } from 'react'
import { SERVER_URL } from '../api_endpoints';

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
                setContent(JSON.parse(jsonContent));

                setMeta({
                    title: data.title || 'Untitled',
                    description: data.description || '',
                    posted_by: data.authorUsername || 'Unknown',
                    updated_at: new Date(data.updated_at).toLocaleString() || '',
                    profile_pic: data.authorProfilePic || defaultProfilePic,
                    thumbnail_url: data.thumbnail
                });

                setFound(true)

            })
            .catch(e => console.error(e))
            .finally(() => setLoading(false))
    }, [])


    return { content, meta, loading, found };
}

export default useWriteup