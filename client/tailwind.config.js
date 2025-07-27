/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // Adjust based on your project structure
        "./public/index.html",
    ],
    darkMode: 'class', // Optional: support dark mode
    theme: {
        extend: {
            fontFamily: {
                mono: ['"Fira Code"', 'monospace'], // Hacker-like monospace font
            },
            colors: {
                hacker: {
                    bg: '#0f0f0f',
                    text: '#00ff00',
                    accent: '#39ff14',
                },
            },
            animation: {
                'hacker-bg': 'hacker 10s linear infinite',
            },
            keyframes: {
                hacker: {
                    '0%': { backgroundPosition: '0 0' },
                    '100%': { backgroundPosition: '0 1000px' },
                },
            },
            backgroundImage: {
                hacker: "repeating-linear-gradient(0deg, rgba(0,255,0,0.1) 0px, rgba(0,255,0,0.1) 1px, transparent 1px, transparent 2px)",
            },
            boxShadow: {
                'hacker-glow': '0 0 10px #00ff00, 0 0 20px #00ff00',
            },
        },
    },
    plugins: [],
}
