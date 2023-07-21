import { AliasesList, TermList } from '@wmde/wikibase-datamodel-types';
import { Fingerprintable } from '@wmde/wikibase-datamodel-types';

export default interface FingerprintableEntity extends Fingerprintable {
	readonly id: string;
	readonly labels: TermList;
	readonly descriptions: TermList;
	readonly aliases: AliasesList;
}

export function newFingerprintableEntity(
	id: string,
	labels: TermList,
	descriptions: TermList,
	aliases: AliasesList,
): FingerprintableEntity {
	return { id, labels, descriptions, aliases };
}
