const URL = require( 'url' ).URL;
const TARGET_NODE = process.env.WEBPACK_TARGET === 'node';
const DEV_MODE = process.env.WEBPACK_TARGET === 'dev';
const filePrefix = 'wikibase.termbox.';

const mainEntry = TARGET_NODE
	? './src/server-entry.ts'
	: './src/client-entry.ts';

let repoHost;
let repoScriptPath;
let repoProtocol;

if ( process.env.WIKIBASE_REPO ) {
	const repoUrl = new URL( process.env.WIKIBASE_REPO );
	repoHost = repoUrl.host;
	repoScriptPath = repoUrl.pathname;
	repoProtocol = repoUrl.protocol;
}

/**
 * In production libraries may be provided by ResourceLoader
 * to allow their caching across applications,
 * and during SSR we need the server app and the bundled app to use the same Vue,
 * but in dev it is still webpack's job to make them available
 */
function externals() {
	if ( DEV_MODE ) {
		return [];
	}

	const resourceLoaderModules = [ 'vue', 'vuex' ];
	const resourceLoaderPackageFiles = [
		'./config.json',
	];
	return [
		...resourceLoaderModules,
		...resourceLoaderPackageFiles,
	];
}

// This is a hack. Assets are located in ../assets/ relative to dist/. Migrating to Vue CLI 5 made referring to assets
// outside of dist/ more complicated and this is a workaround to prepend '../' to asset paths. Better solutions welcome.
const publicPath = DEV_MODE ? '' : '../';

module.exports = {
	outputDir: TARGET_NODE ? 'serverDist' : 'dist',
	publicPath,
	configureWebpack: () => ( {
		entry: DEV_MODE ? './src/dev-entry.ts' : mainEntry,
		externals: externals(),
		target: TARGET_NODE ? 'node' : 'web',
		node: TARGET_NODE ? undefined : false,
		output: {
			libraryTarget: DEV_MODE ? undefined : 'commonjs2',
			filename: ( pathData ) => {
				if ( !TARGET_NODE && pathData.chunk.name === 'main' ) {
					return `${filePrefix}init.js`;
				}

				return `${filePrefix}[name].js`;
			},
		},
		optimization: {
			splitChunks: undefined,
			minimize: !TARGET_NODE, // needed for comparison of `.constructor.name`s
		},
	} ),
	chainWebpack: ( config ) => {
		config.optimization.delete( 'splitChunks' );

		if ( process.env.NODE_ENV === 'production' ) {
			config.plugin( 'extract-css' )
				.tap( ( [ options, ...args ] ) => [
					Object.assign( {}, options, { filename: `${filePrefix}[name].css` } ),
					...args,
				] );
			config.module.rule( 'image' ).set( 'generator', {
				// Keep image path and filename as they are. ResourceLoader directly accesses assets/.
				filename: '[path]/[name][ext]',
			} );
		}

		config.module
			.rule( 'vue' )
			.use( 'vue-loader' )
			.tap( ( options ) =>
				Object.assign( options, {
					optimizeSSR: false,
					compilerOptions: {
						directiveTransforms: {
							focus: () => ( { props: [] } ),
							inlanguage: require( './src/server/directiveTransforms/inlanguage' ),
						},
					},
				} ) );

		config.module.rule( 'js' ).use( 'babel-loader' )
			.tap( ( options ) => Object.assign( options, { cacheDirectory: false } ) );
	},
	css: {
		loaderOptions: {
			sass: {
				additionalData: '@use "sass:math"; @import "@/styles/_main.scss";',
			},
		},
	},
	devServer: {
		proxy: {
			'^/csrMWProxy': {
				target: `${repoProtocol}//${repoHost}`,
				pathRewrite: { '^/csrMWProxy': repoScriptPath },
			},
		},
	},
	parallel: false, // the compilerOptions.directiveTransforms are not serializable
};
