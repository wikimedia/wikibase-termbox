module.exports = {
	env: {
		jest: true,
	},
	rules: {
		// we probably want to lint this in the long run, but on introduction it was overwhelming
		'@typescript-eslint/explicit-function-return-type': 'off',

		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
	},
};
