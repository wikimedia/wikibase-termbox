import { Fingerprintable } from '@wmde/wikibase-datamodel-types';
import { URL } from 'url';

interface EntityState extends Fingerprintable {
	id: string;
	isEditable: boolean;
	baseRevision: number;
	baseRevisionFingerprint: Fingerprintable | null;
	tempUserRedirectUrl: URL | null;
}

export default EntityState;
