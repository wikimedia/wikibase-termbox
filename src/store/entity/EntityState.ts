import { Fingerprintable } from '@wmde/wikibase-datamodel-types';

interface EntityState extends Fingerprintable {
	id: string;
	isEditable: boolean;
	baseRevision: number;
	baseRevisionFingerprint: Fingerprintable | null;
}

export default EntityState;
