import UserLoadingContext from '../contexts/userLoadingContext';
import useWriteupOwner from '../hooks/useWriteupOwner'
import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';
import Loader from './Loader';
import NotAuthorized from './NotAuthorized';
import useWriteup from '../hooks/useWriteup';
import { useEffect } from 'react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { SERVER_URL } from '../api_endpoints';
import UserContext from '../contexts/userContext';

const EditWriteUp = () => {
    const { uuid } = useParams()
    const { isOwner } = useWriteupOwner(uuid);
    const { userLoading } = useContext(UserLoadingContext)
    const { user } = useContext(UserContext)

    const writeup = useWriteup(uuid);

    useEffect(() => {
        console.log(writeup)
    }, [writeup])

    if (userLoading) {
        return <Loader />;
    }

    if (!isOwner && !(user && user.roles.includes('ROLE_ADMIN'))) {
        return <NotAuthorized customMessage={"You are not allowed to edit this writeup"} />;
    }
    return (
        <>
            <h1 className='w-full text-center text-3xl my-4'>Edit Write Up</h1>
            <div>
                <div className='w-fit mx-auto mt-4 border-solid border-b-2 border-black 2p-4'>
                    <SimpleEditor defaultContent={writeup.content} publishURL={`${SERVER_URL}/writeups/${uuid}/edit`}
                        title={writeup.meta.title} description={writeup.meta.description} thumbnail_url={writeup.meta.thumbnail_url}
                        action={"UPDATE"} />
                </div>
            </div>
        </>
    )
}

export default EditWriteUp