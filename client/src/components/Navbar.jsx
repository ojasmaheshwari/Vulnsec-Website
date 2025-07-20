import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className='w-full h-24 bg-gray-800 text-white flex items-center'>
            <h1 className='text-2xl font-bold mx-2'>
                <Link to="/">VulnSec</Link>
            </h1>
        </div>
    )
}

export default Navbar