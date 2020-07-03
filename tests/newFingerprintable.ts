import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import { Term } from '@wmde/wikibase-datamodel-types';

function stringListToTermListMap( values: { [ language: string ]: string[] } ) {
	const aliases: { [ language: string ]: Term[] } = {};

	Object.entries( values ).forEach( ( [ language, aliasValues ] ) => {
		aliases[ language ] = aliasValues.map( ( value ) => ( { language, value } ) );
	} );

	return aliases;
}

function stringToTermMap( values: { [ language: string ]: string } ) {
	const terms: { [ language: string ]: Term } = {};

	Object.entries( values ).forEach( ( [ language, value ] ) => {
		terms[ language ] = { language, value };
	} );

	return terms;
}

interface CondensedFingerprintable {
	id?: string;
	labels?: { [languageCode: string]: string };
	descriptions?: { [languageCode: string]: string };
	aliases?: { [languageCode: string]: string[] };
}

export default function newFingerprintable( { id, labels, descriptions, aliases }: CondensedFingerprintable ) {
	return new FingerprintableEntity(
		id || 'Q1',
		labels ? stringToTermMap( labels ) : {},
		descriptions ? stringToTermMap( descriptions ) : {},
		aliases ? stringListToTermListMap( aliases ) : {},
	);
}
