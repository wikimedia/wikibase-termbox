import fs from 'fs';
import express from 'express';
import { createBundleRenderer } from 'vue-server-renderer';

const app = express();
const serverBundle = fs.readFileSync( './serverDist/vue-ssr-server-bundle.json' );
const renderer = createBundleRenderer(
	JSON.parse( serverBundle.toString() ),
	{ runInNewContext: false },
);

app.get( '/termbox', ( _, res ) => {
	const context = {
		message: 'Hello from server',
	};
	renderer.renderToString( context, ( err, html ) => {
		if ( err ) {
			console.log( err );
		}
		res.send( html );
	} );
} );

export default app;
