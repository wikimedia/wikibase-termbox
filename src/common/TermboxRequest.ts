import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

export default class TermboxRequest {
	public readonly language: string;
	public readonly entity: FingerprintableEntity;

	constructor( language: string, entity: FingerprintableEntity ) {
		this.language = language;
		this.entity = entity;
	}

}
