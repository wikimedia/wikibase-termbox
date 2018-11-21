export default class TermboxRequest {
	public readonly language: string;
	public readonly entityId: string;

	constructor( language: string, entityId: string ) {
		this.language = language;
		this.entityId = entityId;
	}

}
