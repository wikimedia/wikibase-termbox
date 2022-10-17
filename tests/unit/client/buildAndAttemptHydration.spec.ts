import buildAndAttemptHydration from '@/client/buildAndAttemptHydration';
import TermboxServices from '@/common/TermboxServices';
import TermboxRequest from '@/common/TermboxRequest';
import { ConfigOptions } from '../../../src/components/mixins/newConfigMixin';

const mockBuildApp = jest.fn();
jest.mock( '@/common/buildApp', () => ( {
	__esModule: true,
	default: ( termboxRequest: TermboxRequest, services: TermboxServices, config: ConfigOptions ) =>
		mockBuildApp( termboxRequest, services, config ),
} ) );

describe( 'buildAndAttemptHydration', () => {

	afterEach( () => {
		document.documentElement.innerHTML = '';
	} );

	it( 'builds and mounts the app on an existing wrapper element', () => {
		const termboxRequest = new ( jest.fn() )();
		const services = new ( jest.fn() )();
		const config = new ( jest.fn() )();
		const mockApp = { mount: jest.fn(), config: {} };
		mockBuildApp.mockReturnValue( Promise.resolve( mockApp ) );

		// tree: outer > wrapper > root; outer > unrelated
		const outerElement = document.createElement( 'div' );
		outerElement.classList.add( 'wikibase-entityview-main' );
		document.documentElement.appendChild( outerElement );
		const wrapperElement = document.createElement( 'div' );
		wrapperElement.classList.add( 'wikibase-entitytermsview-wrapper' );
		outerElement.appendChild( wrapperElement );
		const rootElement = document.createElement( 'section' );
		rootElement.classList.add( 'wikibase-entitytermsview' );
		wrapperElement.appendChild( rootElement );
		const unrelatedElement = document.createElement( 'div' );
		unrelatedElement.id = 'toc';
		outerElement.appendChild( unrelatedElement );

		return buildAndAttemptHydration( termboxRequest, services, config ).then( () => {
			expect( mockBuildApp ).toHaveBeenCalledTimes( 1 );
			expect( mockBuildApp ).toHaveBeenCalledWith( termboxRequest, services, config );
			expect( mockApp.mount ).toHaveBeenCalledTimes( 1 );
			expect( mockApp.mount ).toHaveBeenCalledWith( wrapperElement );
			expect( unrelatedElement.parentElement ).toBe( outerElement );
		} );
	} );

	it( 'builds and mounts the app on a newly created wrapper element', () => {
		const termboxRequest = new ( jest.fn() )();
		const services = new ( jest.fn() )();
		const config = new ( jest.fn() )();
		const mockApp = { mount: jest.fn(), config: {} };
		mockBuildApp.mockReturnValue( Promise.resolve( mockApp ) );

		// tree: outer > root; outer > unrelated
		const outerElement = document.createElement( 'div' );
		outerElement.classList.add( 'wikibase-entityview-main' );
		document.documentElement.appendChild( outerElement );
		const rootElement = document.createElement( 'section' );
		rootElement.classList.add( 'wikibase-entitytermsview' );
		outerElement.appendChild( rootElement );
		const unrelatedElement = document.createElement( 'div' );
		unrelatedElement.id = 'toc';
		outerElement.appendChild( unrelatedElement );

		return buildAndAttemptHydration( termboxRequest, services, config ).then( () => {
			// expected tree: outer > wrapper > root; outer > unrelated
			expect( mockBuildApp ).toHaveBeenCalledTimes( 1 );
			expect( mockBuildApp ).toHaveBeenCalledWith( termboxRequest, services, config );
			expect( mockApp.mount ).toHaveBeenCalledTimes( 1 );
			const wrapperElement = mockApp.mount.mock.calls[ 0 ][ 0 ] as HTMLElement;
			expect( wrapperElement.className ).toBe( 'wikibase-entitytermsview-wrapper' );
			expect( wrapperElement.parentElement ).toBe( outerElement );
			expect( unrelatedElement.parentElement ).toBe( outerElement );
			// The root element is discarded, thus has neither a parent nor children
			expect( rootElement.parentElement ).toBeNull();
			expect( rootElement.childElementCount ).toBe( 0 );
		} );
	} );

	it( 'does nothing on DOM without root element', () => {
		const termboxRequest = new ( jest.fn() )();
		const services = new ( jest.fn() )();
		const config = new ( jest.fn() )();

		const html = '<head></head><body><div></div></body>';
		document.documentElement.innerHTML = html;

		return buildAndAttemptHydration( termboxRequest, services, config ).then( () => {
			expect( mockBuildApp ).not.toHaveBeenCalled();
			expect( document.documentElement.innerHTML ).toBe( html );
		} );
	} );

} );
