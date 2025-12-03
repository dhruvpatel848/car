/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',
                dark: '#111111',
                darker: '#0a0a0a',
                accent: '#ef4444',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Syne', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
