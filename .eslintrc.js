module.exports = {
	extends: [
		'wikimedia',
		'wikimedia/node',
		'wikimedia/client',
		'wikimedia/language/es6',
		'wikimedia/language/es2017',
		'plugin:vue/strongly-recommended',
		'@wmde/wikimedia-typescript',
	],
	plugins: [
		'filenames',
	],
	parser: 'vue-eslint-parser',
	root: true,
	rules: {
		'function-paren-newline': [ 'error', 'consistent' ],
		'filenames/match-exported': 'error',
		'object-shorthand': [ 'error', 'always' ],

		// problematic in TypeScript / ES6
		'no-unused-vars': 'off',
		'no-undef': 'error',

		// diverging from Wikimedia rule set
		'max-len': [ 'error', 120 ],
		'comma-dangle': [ 'error', {
			arrays: 'always-multiline',
			objects: 'always-multiline',
			imports: 'always-multiline',
			exports: 'always-multiline',
			functions: 'always-multiline',
		} ],
		'operator-linebreak': 'off',
		'quote-props': 'off',
		'valid-jsdoc': 'off',

		'vue/html-indent': [ 'error', 'tab' ],
		'vue/max-attributes-per-line': [ 'error', {
			singleline: 3,
			multiline: 1,
		} ],
		'vue/multi-word-component-names': 'off',

		'no-restricted-properties': 'off',
	},
	overrides: [
		{
			files: [ '**/*.ts' ],
			parser: 'vue-eslint-parser',
			rules: {
				'no-undef': 'off',
			},
		},
		{
			files: [ '*.js' ],
			rules: {
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/explicit-member-accessibility': 'off',
				'@typescript-eslint/no-var-requires': 'off',
			},
		},
	],

	parserOptions: {
		parser: '@typescript-eslint/parser',
	},
};
