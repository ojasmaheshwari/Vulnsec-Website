import React, { useContext } from 'react'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { useState } from 'react';
import { EditorContext } from '@tiptap/react';

const WriteUpEditor = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        thumbnail: "",
    });
    const { editor } = useContext(EditorContext)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePreview = () => {
    };

    const handlePublish = () => {
        // Replace this with your publishing logic
        // formData["content"] =

        console.log(editor)
    };

    return (
        <>
            <h1 className='w-full text-center text-3xl my-4'>Create a Write Up</h1>
            <div>
                <div className='w-fit mx-auto mt-4 border-solid border-b-2 border-black 2p-4'>
                    <SimpleEditor />
                </div>
            </div>

        </>
    )
}

export default WriteUpEditor