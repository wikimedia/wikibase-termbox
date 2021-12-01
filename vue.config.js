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

	// get external packages from @wmde/lib-version-check config
	const package = require( './package.json' );
	const resourceLoaderModules = Object.keys( package.config.remoteVersion );
	const resourceLoaderPackageFiles = [
		'./config.json',
	];
	return [
		...resourceLoaderModules,
		...resourceLoaderPackageFiles,
	];
}

module.exports = {
	outputDir: TARGET_NODE ? 'serverDist' : 'dist',
	configureWebpack: () => ( {
		entry: DEV_MODE ? [ './src/dev-entry.ts', mainEntry ] : mainEntry,
		externals: externals(),
		target: TARGET_NODE ? 'node' : 'web',
		node: TARGET_NODE ? undefined : false,
		output: {
			libraryTarget: DEV_MODE ? undefined : 'commonjs2',
			filename: `${filePrefix}[name].js`,
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

			// ResourceLoader has access to /assets/* and /dist/*.css - use assets directly
			config.module
				.rule( 'images' )
				.test( /\.(png|jpe?g|gif|svg)(\?.*)?$/ )
				.use( 'url-loader' )
				.loader( 'url-loader' )
				.options( {
					limit: -1,
					name: '[path]/[name].[ext]',
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
	},
	css: {
		loaderOptions: {
			sass: {
				additionalData: '@import "@/styles/_main.scss";',
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
