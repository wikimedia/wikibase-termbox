import fs from 'fs';
import express from 'express';
import { createBundleRenderer } from 'vue-server-renderer';
import TermboxRequest from '@/common/TermboxRequest';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

const app = express();
const serverBundle = fs.readFileSync( './serverDist/vue-ssr-server-bundle.json' );
const renderer = createBundleRenderer(
	JSON.parse( serverBundle.toString() ),
	{ runInNewContext: false },
);

app.get( '/termbox', ( _, res ) => {
	const termboxRequest = new TermboxRequest( // TODO: this is supposed to be dynamic
		'en',
		new FingerprintableEntity(
			'Q64',
			{},
			{},
			{},
		),
	);
	renderer.renderToString( termboxRequest )
		.then( ( html ) => {
			res.send( html );
		} )
		.catch( ( err ) => {
			console.log( err );
		} );
} );

export default app;
