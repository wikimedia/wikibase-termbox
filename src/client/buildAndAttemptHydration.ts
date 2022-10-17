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
		return; // no termbox on this page (history, diffonly…)
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

	// T318137: Due to https://github.com/vuejs/core/issues/5063 we can't rely on
	// Vue's hydration (as of October 2022).
	wrapperElement.textContent = '';

	app.mount( wrapperElement );
}
