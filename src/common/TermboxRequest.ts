export default class TermboxRequest {
	public readonly language: string;
	public readonly entityId: string;
	public readonly editLinkUrl: string;
	public readonly secondaryLanguages: string[];

	constructor(
		language: string,
		entityId: string,
		editLinkUrl: string,
		secondaryLanguages: string[],
	) {
		this.language = language;
		this.entityId = entityId;
		this.editLinkUrl = editLinkUrl;
		this.secondaryLanguages = secondaryLanguages;
	}

}
