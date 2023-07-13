const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    corePlugins: {
        preflight: false
    },
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        screens: {
            xs: '350px',
            ...defaultTheme.screens
        },
        extend: {}
    },
    plugins: []
};
