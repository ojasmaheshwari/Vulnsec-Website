import React from 'react'
import { Link } from 'react-router-dom'
import UserContext from '../contexts/userContext'
import { useContext } from 'react'

const Home = () => {
    const { user, setUser } = useContext(UserContext);

    return (
        <div className='w-full h-screen flex items-center flex-col'>
            <h1 className='text-4xl font-bold mt-32'>VulnSec</h1>
            <h2 className='mt-2 mx-2 text-center'>Group of driven individuals getting better at Hacking through CTFs and Bug Bounty</h2>

            <div className='flex flex-col my-12'>
                <h1 className='font-bold text-lg mb-2'>Common Actions</h1>

                <ul className='list-disc'>
                    <li><Link to="/login" className='underline'>Login</Link></li>
                    <li><Link to="/writeups" className='underline'>Blogs / Write-Ups</Link></li>
                    <li><Link to="/chat" className='underline'>Chatrooms</Link></li>
                    {user && (user.roles.includes('ROLE_VULNSEC_MEMBER') || user.roles.includes('ROLE_ADMIN')) && <li><Link to="/create-writeup" className='underline'>Create writeups</Link></li>}
                </ul>
            </div>
        </div>
    )
}

export default Home