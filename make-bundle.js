const { readFile, writeFile } = require( 'fs' ).promises;
const process = require( 'process' );

async function main() {
	const js = await readFile( 'serverDist/wikibase.termbox.main.js', 'utf8' );
	const map = await readFile( 'serverDist/wikibase.termbox.main.js.map', 'utf8' );
	const bundle = {
		entry: 'wikibase.termbox.main.js',
		files: {
			'wikibase.termbox.main.js': js,
		},
		maps: {
			'wikibase.termbox.main.js': JSON.parse( map ),
		},
	};
	await writeFile( 'serverDist/vue-ssr-server-bundle.json', JSON.stringify( bundle ) );
}

main().catch( ( e ) => {
	// eslint-disable-next-line no-console
	console.error( e );
	process.exitCode = 1;
} );
