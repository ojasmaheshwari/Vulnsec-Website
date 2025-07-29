import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound = ({ customMessage }) => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">
            <div className="flex flex-col items-center space-y-4 animate-fade-in">
                <AlertCircle size={64} className="text-red-500" />
                <h1 className="text-5xl font-bold tracking-wide">404</h1>
                <p className="text-lg text-gray-300">{customMessage ? customMessage : "Oops! The page you're looking for doesn't exist."}</p>
                <Link
                    to="/"
                    className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 transition-all duration-200 text-white rounded-xl shadow-lg"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
