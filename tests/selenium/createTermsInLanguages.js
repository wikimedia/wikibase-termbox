const MWUtil = require( 'wdio-mediawiki/Util' );

function newTerm( language ) {
	return { language, value: MWUtil.getTestString() };
}

module.exports = ( languages ) => {
	const terms = { labels: {}, descriptions: {}, aliases: {} };

	languages.forEach( ( language ) => {
		terms.labels[ language ] = newTerm( language );
		terms.descriptions[ language ] = newTerm( language );
		terms.aliases[ language ] = [ newTerm( language ), newTerm( language ) ];
	} );

	return terms;
};
