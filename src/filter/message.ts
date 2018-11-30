/**
 * TODO dynamic messages
 * When state (user language) comes into play, using a computed will likely be
 * the more correct™ approach - https://stackoverflow.com/a/42829248
 */
export default ( key: string ): string => {
	// TODO add to wikibase i18n - so far it was hard coded in wikibase view/resources/wikibase/wikibase.mobile.css
	if ( key === 'wikibase-termbox-alias-separator' ) {
		return '|';
	}
	return key;
};
