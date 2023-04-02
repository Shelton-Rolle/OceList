/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#2E2D4D',
                    dark: '#FFD5FF',
                },
                secondary: {
                    light: '#3FA7D6',
                    dark: '#FDF5BF',
                },
                accent: {
                    light: '#FDF5BF',
                    dark: '#414068',
                },
                default: {
                    light: '#2D2E2E',
                    dark: '#9CFFFA',
                },
                background: {
                    light: '#FFFFFF',
                    dark: '#03080E',
                },
            },
            fontFamily: {
                title: ['Roboto', 'sans serif'],
                paragraph: ['Poppins', 'Roboto', 'sans serif'],
            },
            fontSize: {
                h1: '48px',
                h2: '40px',
                h3: '36px',
                h4: '32px',
                h5: '28px',
                h6: '24px',
                paragraph: '16px',
            },
            animation: {
                'open-line-1': 'open-line-1 400ms forwards ease-in-out',
                'open-line-2': 'open-line-2 400ms forwards ease-in-out',
                'open-line-3': 'open-line-3 400ms forwards ease-in-out',
                'close-line-1': 'close-line-1 400ms forwards ease-in-out',
                'close-line-2': 'close-line-2 400ms forwards ease-in-out',
                'close-line-3': 'close-line-3 400ms forwards ease-in-out',
            },
            keyframes: {
                // https://tailwindcss.com/docs/animation to learn more about tailwindcss animations
                'open-line-1': {
                    '0%': { width: '100%', marginLeft: 'auto' },
                    '100%': { width: '25%' },
                },
                'open-line-2': {
                    '0%': { width: '50%', marginRight: 'auto' },
                    '50%': { width: '100%' },
                    '100%': { marginLeft: 'auto', width: '50%' },
                },
                'open-line-3': {
                    '0%': { width: '25%', marginRight: 'auto' },
                    '100%': { marginRight: 'auto', width: '100%' },
                },
                'close-line-1': {
                    '0%': { width: '25%', marginLeft: 'auto' },
                    '100%': { marginLeft: 'auto', width: '100%' },
                },
                'close-line-2': {
                    '0%': { width: '50%', marginLeft: 'auto' },
                    '50%': { width: '100%' },
                    '100%': { marginRight: 'auto', width: '50%' },
                },
                'close-line-3': {
                    '0%': { width: '100%' },
                    '100%': { marginRight: 'auto', width: '25%' },
                },
            },
        },
    },
    plugins: [],
};
