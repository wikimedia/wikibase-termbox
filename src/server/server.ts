import path from 'path';
import dotenv from 'dotenv';
import app from './app';

dotenv.config( {
	path: path.resolve( __dirname, '.env' ),
} );

const port = process.env.SSR_PORT;

app.listen( port, () => {
	console.log( `server is running at port ${port}` );
} );
