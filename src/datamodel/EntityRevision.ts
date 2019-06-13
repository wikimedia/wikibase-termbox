import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

export default class EntityRevision {
	public readonly entity: FingerprintableEntity;
	public readonly revisionId: number;

	public constructor( entity: FingerprintableEntity, revisionId: number ) {
		this.entity = entity;
		this.revisionId = revisionId;
	}

}
