import fs from 'fs';
import path from 'path';
import express from 'express';
import { createBundleRenderer } from 'vue-server-renderer';

const app = express();
const port = 3030;
const serverBundle = fs.readFileSync( './dist/vue-ssr-server-bundle.json' );
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

app.listen( 3030, () => {
    console.log( `server is running at port ${port}` );
} );
