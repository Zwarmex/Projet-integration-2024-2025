/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				main: 'var(--main)',
				bg: 'var(--bg)',
				text: 'var(--text)',
				'text-secondary': 'var(--text-secondary)',
				success: 'var(--success)',
				danger: 'var(--danger)',
				warning: 'var(--warning)',
				info: 'var(--info)',
				light: 'var(--light)',
				dark: 'var(--dark)',
				white: 'var(--white)',
				black: 'var(--black)',
				input: 'var(--input)',
				muted: 'var(--muted)',
				form: 'var(--form)',
			},
		},
	},
	plugins: [],
};
