import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

export default class EntityRevisionWithRedirect {
	public readonly entity: FingerprintableEntity;
	public readonly revisionId: number;
	public readonly redirectUrl: string|undefined;

	public constructor( entity: FingerprintableEntity, revisionId: number, redirectUrl: string|undefined = undefined ) {
		this.entity = entity;
		this.revisionId = revisionId;
		this.redirectUrl = redirectUrl;
	}

}
