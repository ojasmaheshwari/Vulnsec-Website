import { SERVER_URL } from '/src/api_endpoints';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loader from './Loader';
import { useEditor, EditorContent } from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit';

import { generateJSON } from '@tiptap/react';

import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

const WriteUp = () => {
    const { uuid } = useParams();
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState(null)
    const editor = useEditor({
        extensions: [StarterKit, Image, TaskItem, TaskList],
        content,
        editable: false
    }, [content])


    useEffect(() => {
        fetch(`${SERVER_URL}/writeups/${uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => {
            if (res.status !== 200) {
                alert("Something went wrong. Please try again later")
                return;
            }
            return res.json()
        })
            .then(jsonResponse => {
                const { data } = jsonResponse;

                // const htmlContent = generateJSON(data.content, [
                //     StarterKit,
                //     // Add other extensions you use (like TaskList, Image, etc.)
                //     Image,
                //     TaskItem,
                //     TaskList,
                //     TextAlign,
                //     Typography,
                //     Highlight,
                //     Subscript,
                //     Superscript,
                //     Selection
                // ])
                const jsonContent = JSON.parse(data.content)
                setContent(JSON.parse(jsonContent))
            }).catch(e => console.error(e)).finally(() => setLoading(false))


    }, [])

    if (loading) {
        return <Loader />
    }

    return (
        <div className=" max-w-none flex justify-center py-12 px-4">
            <EditorContent editor={editor} />
        </div>
    )
}

export default WriteUp