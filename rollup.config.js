const path = require( 'path' );
const dts = require( 'rollup-plugin-dts' ).default;
const alias = require( '@rollup/plugin-alias' ).default;

module.exports = [
	{
		input: './dist/client-entry-type.d.ts',
		output: [ { file: 'dist/wikibase.termbox.init.d.ts', format: 'es' } ],
		plugins: [
			dts(),
			alias( {
				entries: [
					{ find: '@', replacement: path.resolve( path.resolve( __dirname ), 'dist' ) },
				],
			} ),
		],
	},
];
