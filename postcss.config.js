const { browserslist } = require( './package.json' );

module.exports = {
	plugins: {
		autoprefixer: {
			overrideBrowserslist: [
				...browserslist,
				'ie 10',
			],
		},
		'postcss-prefixwrap': '.wikibase-entitytermsview', // base selector; see App.vue
	},
};
