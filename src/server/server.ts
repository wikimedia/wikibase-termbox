import path from 'path';
import dotenv from 'dotenv';
import 'module-alias/register';
import app from './app';

dotenv.config( {
	path: path.resolve( __dirname, '../../.env' ),
} );

const port = process.env.SSR_PORT;

app.set( 'WIKIBASE_REPO_API', process.env.WIKIBASE_REPO_API );

console.log( `WIKIBASE_REPO_API is set to ${process.env.WIKIBASE_REPO_API}` );

app.listen( port, () => {
	console.log( `server is running at port ${port}` );
} );
