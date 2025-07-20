import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div className='w-full h-screen flex items-center flex-col'>
            <h1 className='text-4xl font-bold mt-32'>VulnSec</h1>
            <h2 className='mt-2 mx-2 text-center'>Group of driven individuals getting better at Hacking through CTFs and Bug Bounty</h2>

            <div className='flex flex-col my-12'>
                <h1 className='font-bold text-lg mb-2'>Common Actions</h1>

                <ul className='list-disc'>
                    <li><Link to="/login" className='hover:underline'>Login</Link></li>
                    <li><Link to="/blogs" className='hover:underline'>Blogs / Write-Ups</Link></li>
                    <li><Link to="/chat" className='hover:underline'>Chatrooms</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default Home