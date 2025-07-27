import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import UserContext from '../contexts/userContext'
import { FaUserCircle } from 'react-icons/fa'

const Navbar = () => {
    const { user } = useContext(UserContext);

    return (
        <div className="w-full h-20 px-6 backdrop-blur bg-gray-800/70 text-white shadow-md flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-3xl font-extrabold text-cyan-400 hover:text-cyan-300 transition-all duration-200">
                VulnSec
            </Link>

            {/* Nav Items */}
            <ul className="flex items-center gap-6">
                {user ? (
                    <li className="flex items-center gap-2 text-lg">
                        <FaUserCircle className="text-2xl text-cyan-300" />
                        <Link to='/profile' className="hover:underline">{user.username}</Link>
                    </li>
                ) : (
                    <>
                        <li>
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white transition-all duration-200"
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/sign-up"
                                className="px-4 py-2 rounded-xl bg-white text-cyan-600 hover:bg-gray-100 font-semibold transition-all duration-200"
                            >
                                Sign Up
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    )
}

export default Navbar
