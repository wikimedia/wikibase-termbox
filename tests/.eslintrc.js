module.exports = {
	env: {
		jest: true,
	},
	rules: {
		// we probably want to lint this in the long run, but on introduction it was overwhelming
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',

		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',

		'@typescript-eslint/ban-types': [ 'error', {
			extendDefaults: true,
			types: {
				Function: false, // allow this as a type covering any function (e.g. jest.fn())
			},
		} ],
	},
};
