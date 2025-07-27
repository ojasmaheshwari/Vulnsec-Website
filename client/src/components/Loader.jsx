import React, { useEffect, useState } from 'react';

const Loader = () => {
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-gray-800 text-white px-4">
            <img
                src="https://cdn.dribbble.com/userupload/23237805/file/original-b01f81713802bdc20e9ce2ba275aec43.gif"
                alt="Loading..."
                className="w-64 h-64 rounded-xl shadow-lg mb-6"
            />
            {showMessage && (
                <p className="text-lg text-center text-gray-300 animate-pulse">
                    Please be patient... We run on free servers 🙏
                </p>
            )}
        </div>
    );
};

export default Loader;
