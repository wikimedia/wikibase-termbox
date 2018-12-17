export default class TermboxRequest {
	public readonly language: string;
	public readonly entityId: string;
	public readonly editLinkUrl: string;

	constructor( language: string, entityId: string, editLinkUrl: string ) {
		this.language = language;
		this.entityId = entityId;
		this.editLinkUrl = editLinkUrl;
	}

}
