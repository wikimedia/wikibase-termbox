import Fingerprintable from '@/datamodel/Fingerprintable';

interface EntityState extends Fingerprintable {
	id: string;
	isEditable: boolean;
	baseRevision: number;
	baseRevisionFingerprint: Fingerprintable | null;
}

export default EntityState;
