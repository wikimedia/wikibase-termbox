const path = require( 'path' );
const ourVueConfig = require( '../vue.config' );

module.exports = async ( { config } ) => {
	config.resolve.alias[ '@' ] = path.resolve( __dirname, '../src' );

	config.module.rules.push( {
		test: /\.scss$/,
		use: [
			'vue-style-loader',
			'css-loader',
			{
				loader: 'sass-loader',
				options: ourVueConfig.css.loaderOptions.sass,
			},
		],
	} );

	return config;
};
