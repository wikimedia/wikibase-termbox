module.exports = {
	plugins: {
		autoprefixer: {
			overrideBrowserslist: [
				'extends browserslist-config-base',
				'ie 10',
			],
		},
		'postcss-prefixwrap': '.wikibase-entitytermsview', // base selector; see App.vue
	},
};
