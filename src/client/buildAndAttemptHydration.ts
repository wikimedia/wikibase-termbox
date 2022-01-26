import buildApp from '@/common/buildApp';
import TermboxServices from '@/common/TermboxServices';
import TermboxRequest from '@/common/TermboxRequest';
import { ConfigOptions } from '@/components/mixins/newConfigMixin';

export default async function buildAndAttemptHydration(
	termboxRequest: TermboxRequest,
	services: TermboxServices,
	config: ConfigOptions,
): Promise<void> {
	const rootElement = document.querySelector( '.wikibase-entitytermsview' );
	if ( !rootElement ) {
		throw new Error( 'No Termbox root element found!' );
	}

	// create a wrapper <div> if it doesn’t exist yet:
	// as of 2022-01-26, no server-side code to add this wrapper exists yet,
	// but we’d like to add it at some point
	let wrapperElement = rootElement.parentElement as HTMLElement;
	if ( !wrapperElement.classList.contains( 'wikibase-entitytermsview-wrapper' ) ) {
		const parentElement = wrapperElement;
		wrapperElement = document.createElement( 'div' );
		wrapperElement.classList.add( 'wikibase-entitytermsview-wrapper' );
		parentElement.replaceChild( wrapperElement, rootElement );
		wrapperElement.appendChild( rootElement );
		parentElement.insertBefore(
			document.createComment(
				'Please do not use the wrapper element in CSS etc., ' +
				'it may not exist in server-rendered HTML.',
			),
			wrapperElement,
		);
	}

	const app = await buildApp( termboxRequest, services, config );

	// mount the app in the wrapper element,
	// hiding warnings and errors because we know the DOM won’t hydrate perfectly (T300176)
	/* eslint-disable no-console */
	app.config.warnHandler = () => undefined;
	const consoleError = console.error;
	console.error = ( ...args ) => {
		if ( args.length === 1 && args[ 0 ] === 'Hydration completed but contains mismatches.' ) {
			// ignore, Vue offers no way to hide this hard-coded warning
		} else {
			return consoleError( ...args );
		}
	};
	try {
		app.mount( wrapperElement );
	} finally {
		console.error = consoleError;
	}
	/* eslint-enable no-console */
}
