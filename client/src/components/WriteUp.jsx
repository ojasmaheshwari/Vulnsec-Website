import { SERVER_URL } from '/src/api_endpoints';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loader from './Loader';
import { useEditor, EditorContent } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";

import { defaultProfilePic } from './Profile';

import { LucideThumbsUp } from 'lucide-react';
import { LucideThumbsDown } from 'lucide-react';

import { ToastContainer, toast } from 'react-toastify';
import NotFound from './NotFound';

import { useNavigate } from 'react-router-dom';

const WriteUp = () => {
    const { uuid } = useParams();
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(null);
    const [meta, setMeta] = useState({ title: '', description: '', posted_by: '', updated_at: '' });

    const [reactions, setReactions] = useState({ likes: 0, dislikes: 0 });

    const [found, setFound] = useState(false);

    const likeButtonRef = useRef(null);
    const dislikeButtonRef = useRef(null);

    const navigate = useNavigate();

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
                    // likes: data.likes,
                    // dislikes: data.dislikes
                });

                setFound(true);

            })
            .catch(e => console.error(e))
            .finally(() => setLoading(false));

        // Fetch reactions
        fetchReactions();
    }, []);

    const fetchReactions = () => {
        fetch(`${SERVER_URL}/writeups/${uuid}/reactions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                setReactions({
                    likes: data.data.likes || 0,
                    dislikes: data.data.dislikes || 0
                });
            })
            .catch(err => console.error('Failed to fetch reactions:', err));
    }

    const handleReaction = (type) => {
        fetch(`${SERVER_URL}/writeups/${uuid}/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then(res => {
                if (res.status === 401) {
                    throw new Error(`Only logged-in and email verified users can ${type} a writeup.`);
                }
                return res.json()
            })
            .then(data => {
                if (type === 'like') {
                    likeButtonRef.current.classList.add('bg-blue-100');
                    dislikeButtonRef.current.classList.remove('bg-red-100');
                }
                else {
                    dislikeButtonRef.current.classList.add('bg-red-100');
                    likeButtonRef.current.classList.remove('bg-blue-100');
                }
                fetchReactions()
            })
            .catch(err => {
                toast.error(`${err}`);
                console.error(`Failed to ${type}`, err)
            });
    };

    if (loading) return <Loader />;

    if (!loading && !found) {
        return <NotFound customMessage={"The write up does not exist"} />;
    }

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

                <div className="mt-4 flex gap-3">
                    <button
                        onClick={() => handleReaction('like')}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                        ref={likeButtonRef}
                    >
                        {reactions.likes} <LucideThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleReaction('dislike')}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                        ref={dislikeButtonRef}
                    >
                        {reactions.dislikes} <LucideThumbsDown className="w-4 h-4" />
                    </button>
                </div>

            </div>

            <EditorContent editor={editor} />

            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default WriteUp;
