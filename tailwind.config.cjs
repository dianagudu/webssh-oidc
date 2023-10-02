/** @type {import('tailwindcss').Config} */

module.exports = {
	//content: ['./src/**/*.{html,js,svelte,ts}',
	//  "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// 'mc-blue': 'rgb(var(--color-mc-blue) / 97)',
				// 'mc-orange': 'rgb(var(--color-mc-orange) / 100)',
				// 'mc-gray': 'rgb(var(--color-mc-gray) / 100)',
				'mc-orange': {
					DEFAULT: '#FD5F00',
					50: '#FFD1B6',
					100: '#FFC4A1',
					200: '#FFAB78',
					300: '#FF9150',
					400: '#FF7827',
					500: '#FD5F00',
					600: '#C54A00',
					700: '#8D3500',
					800: '#552000',
					900: '#1D0B00'
				},
				'mc-blue': {
					DEFAULT: '#005792',
					50: '#4BB6FF',
					100: '#36AEFF',
					200: '#0D9DFF',
					300: '#0088E4',
					400: '#006FBB',
					500: '#005792',
					600: '#00365A',
					700: '#001422',
					800: '#000000',
					900: '#000000'
				},
				'mc-gray': {
					DEFAULT: '#666666',
					50: '#C2C2C2',
					100: '#B8B8B8',
					200: '#A3A3A3',
					300: '#8F8F8F',
					400: '#7A7A7A',
					500: '#666666',
					600: '#4A4A4A',
					700: '#2E2E2E',
					800: '#121212',
					900: '#000000'
				}
			},
			fontFamily: {
				sans: ['Barlow Semi Condensed', 'sans-serif']
			}
		}
	},
	plugins: [
		// require('flowbite/plugin')
		require('@tailwindcss/typography')
	],
	darkMode: 'class'
};
