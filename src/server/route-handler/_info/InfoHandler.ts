import { Request, Response, Router } from 'express';
import PackageInfo from '../../metadata/PackageInfo';

export default function ( info: PackageInfo ): Router {
	const router = Router();

	router.get( '/', ( req: Request, res: Response ) => {
		res.json( {
			name: info.name,
			version: info.version,
		} );
	} );

	router.get( '/name', ( req, res ) => {
		res.json( { name: info.name } );
	} );

	router.get( '/version', ( req, res ) => {
		res.json( { version: info.version } );
	} );

	return router;
}
