import 'module-alias/register';
import app from './app';
import { config } from './TermboxConfig';

const port = config.getSsrPort();

app.listen( port, () => {
	console.log( `server is running at port ${port}` );
} );
