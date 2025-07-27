import { SERVER_URL } from '/src/api_endpoints';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loader from './Loader';
import { useEditor, EditorContent } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";

import { defaultProfilePic } from './Profile';

const WriteUp = () => {
    const { uuid } = useParams();
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(null);
    const [meta, setMeta] = useState({ title: '', description: '', posted_by: '', updated_at: '' });

    const editor = useEditor({
        extensions: [StarterKit, Image, TaskItem, TaskList],
        content,
        editable: false
    }, [content]);

    useEffect(() => {
        fetch(`${SERVER_URL}/writeups/${uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (res.status !== 200) {
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
                    // likes: data.likes,
                    // dislikes: data.dislikes
                });

            })
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    const handleReaction = (type) => {
        fetch(`${SERVER_URL}/writeups/${uuid}/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log(`${type} response:`, data);
            })
            .catch(err => console.error(`Failed to ${type}`, err));
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <div className="mb-6 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-bold">{meta.title}</h1>
                <p className="text-sm mt-1">{meta.description}</p>

                <div className="flex items-center mt-3 gap-3 text-sm text-gray-400">
                    <img
                        src={meta.profile_pic || defaultProfilePic}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border border-gray-600"
                    />
                    <span>
                        Posted by <span className="font-semibold text-slate-700 hover:underline">
                            <Link to={`/users/${meta.posted_by}`}>{meta.posted_by}</Link>
                        </span> •{' '}
                        <span className="text-gray-500">{meta.updated_at}</span>
                    </span>
                </div>

                {/* <div className="mt-4 flex gap-3">
                    <button
                        onClick={() => handleReaction('like')}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                    >
                        {meta.likes} Like
                    </button>
                    <button
                        onClick={() => handleReaction('dislike')}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                    >
                        {meta.dislikes} Dislike
                    </button>
                </div> */}

            </div>

            <EditorContent editor={editor} />
        </div>
    );
};

export default WriteUp;
