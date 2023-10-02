module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:svelte/recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier'
	],
	plugins: ['@typescript-eslint/parser'],
	ignorePatterns: ['*.cjs'],
	overrides: [{ files: ['*.svelte'] }],
	settings: {
		'svelte/typescript': () => require('typescript')
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	globals: {
		NodeJS: true
	}
};
