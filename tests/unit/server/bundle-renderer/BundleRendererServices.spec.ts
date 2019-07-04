import BundleRendererServices from '@/server/bundle-renderer/BundleRendererServices';
import axios from 'axios';

describe( 'BundleRendererServices', () => {
	it( 'can be constructed and assigns properties', () => {
		const logger = new ( jest.fn() )();
		const metrics = new ( jest.fn() )();
		const messageCache = new ( jest.fn() )();
		const languageCache = new ( jest.fn() )();
		const queryValidator = new ( jest.fn() )();
		const openApiSpec = new ( jest.fn() )();

		const services = new BundleRendererServices(
			axios,
			logger,
			metrics,
			messageCache,
			languageCache,
			queryValidator,
			openApiSpec,
		);

		expect( services ).toBeInstanceOf( BundleRendererServices );
		expect( services.axios ).toBe( axios );
		expect( services.logger ).toBe( logger );
		expect( services.metrics ).toBe( metrics );
		expect( services.messageCache ).toBe( messageCache );
		expect( services.languageCache ).toBe( languageCache );
		expect( services.termboxQueryValidator ).toBe( queryValidator );
		expect( services.openApiSpec ).toBe( openApiSpec );
	} );

} );
