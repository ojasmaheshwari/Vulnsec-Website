import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import UserContext from '../contexts/userContext'

const Navbar = () => {
    const { user, setUser } = useContext(UserContext);

    return (
        <div className='w-full h-24 bg-gray-800 text-white flex items-center justify-between'>
            <h1 className='text-2xl font-bold mx-4'>
                <Link to="/">VulnSec</Link>
            </h1>

            <ul className='flex gap-4 mx-4'>
                {user ? <li>Welcome {user.username}</li> : (
                    <>
                        <li>
                            <Link to="/login" className='hover:underline'>Login</Link>
                        </li>
                        <li>
                            <Link to="/sign-up" className='hover:underline'>Sign-Up</Link>
                        </li>
                    </>)}
            </ul>
        </div>
    )
}

export default Navbar