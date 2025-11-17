import { getTestString } from 'wdio-mediawiki/Util.js';

function newTerm( language ) {
	return { language, value: getTestString() };
}

export default function createTermsInLanguages( languages ) {
	const terms = { labels: {}, descriptions: {}, aliases: {} };

	languages.forEach( ( language ) => {
		terms.labels[ language ] = newTerm( language );
		terms.descriptions[ language ] = newTerm( language );
		terms.aliases[ language ] = [ newTerm( language ), newTerm( language ) ];
	} );

	return terms;
}
