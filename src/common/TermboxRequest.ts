export default class TermboxRequest {
	public readonly language: string;
	public readonly entityId: string;
	public readonly editLinkUrl: string;
	public readonly preferredLanguages: string[];

	constructor(
		language: string,
		entityId: string,
		editLinkUrl: string,
		preferredLanguages: string[],
	) {
		this.language = language;
		this.entityId = entityId;
		this.editLinkUrl = editLinkUrl;
		this.preferredLanguages = preferredLanguages;
	}
}
