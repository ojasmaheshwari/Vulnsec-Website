import { SERVER_URL } from '/src/api_endpoints';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loader from './Loader';
import { useEditor, EditorContent } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";

import { defaultProfilePic } from './Profile';

import { LucideThumbsUp, User } from 'lucide-react';
import { LucideThumbsDown } from 'lucide-react';
import { LucidePencil } from 'lucide-react';
import { LucideTrash2 } from 'lucide-react';

import { ToastContainer, toast } from 'react-toastify';
import NotFound from './NotFound';

import UserContext from '../contexts/userContext';
import UserLoadingContext from '../contexts/userLoadingContext';

import { useNavigate } from 'react-router-dom';
import useWriteup from '../hooks/useWriteup';
import useWriteupReactions from '../hooks/useWriteupReactions';
import CommentSection from './CommentSection';

const WriteUp = () => {
    const { uuid } = useParams();
    // const [content, setContent] = useState(null);
    // const [meta, setMeta] = useState({ title: '', description: '', posted_by: '', updated_at: '' });
    const navigate = useNavigate();
    const reactions = useWriteupReactions(uuid);

    const likeButtonRef = useRef(null);
    const dislikeButtonRef = useRef(null);

    const { user } = useContext(UserContext);
    const { userLoading } = useContext(UserLoadingContext)

    const [isOwner, setIsOwner] = useState(false);

    const writeup = useWriteup(uuid);

    const editor = useEditor({
        extensions: [StarterKit, Image, TaskItem, TaskList],
        content: writeup.content,
        editable: false
    }, [writeup.content]);

    // When the both user and writeup has finished loading then check if he is owner of this writeup
    useEffect(() => {
        if (userLoading || writeup.loading) return;

        if (!user) return; // User is not logged in

        setIsOwner(user.username === writeup.meta.posted_by);
    }, [userLoading, writeup.loading])

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

                reactions.refresh();
            })
            .catch(err => {
                toast.error(`${err}`);
                console.error(`Failed to ${type}`, err)
            });
    };

    const handleEdit = () => {
        navigate('./edit');
    }

    const handleDelete = () => {
        const confirmation = confirm("Are you sure you want to delete this writeup?");
        if (confirmation) {
            fetch(`${SERVER_URL}/writeups/${uuid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }).then(res => {
                if (res.status === 200) {
                    alert("Writeup Deleted");
                } else {
                    alert("Could not delete writeup. Please contact admin")
                }
            }).catch(err => {
                console.error(err);
            })
        }
    }

    if (writeup.loading) return <Loader />;

    if (!writeup.loading && !writeup.found) {
        return <NotFound customMessage={"The write up does not exist"} />;
    }

    const { meta } = writeup;

    if (user) {
        console.log(user.roles.includes('ROLE_ADMIN'))
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
                        <span className="text-gray-500">{meta.updatedAt}</span>
                    </span>
                </div>

                <div className="mt-4 flex justify-between">
                    <div className='flex gap-3'>
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
                    {(isOwner || (user && user.roles.includes('ROLE_ADMIN'))) && (<div className="flex gap-3">
                        <button className='flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition' onClick={handleEdit}>
                            Edit <LucidePencil className='w-4 h-4' />
                        </button>
                        <button className='flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-red-100 transition' onClick={handleDelete}>
                            Delete <LucideTrash2 className='w-4 h-4' />
                        </button>
                    </div>)}
                </div>

            </div>

            <EditorContent editor={editor} />

            <CommentSection writeupUuid={uuid} />

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
