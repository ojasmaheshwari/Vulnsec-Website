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
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-green-400 px-4 font-mono">
            <img
                src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
                alt="Loading..."
                className="w-64 h-64 rounded-lg shadow-neon mb-6"
            />
            {showMessage && (
                <p className="text-lg text-center animate-typing border-r-2 border-green-400 pr-2 whitespace-nowrap overflow-hidden">
                    Initializing... Please stand by
                </p>
            )}
        </div>
    );
};

export default Loader;
