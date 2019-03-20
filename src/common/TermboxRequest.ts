export default class TermboxRequest {
	public readonly language: string;
	public readonly entityId: string;
	public readonly revision: number;
	public readonly editLinkUrl: string;
	public readonly preferredLanguages: string[];

	constructor(
		language: string,
		entityId: string,
		revision: number,
		editLinkUrl: string,
		preferredLanguages: string[],
	) {
		this.language = language;
		this.entityId = entityId;
		this.revision = revision;
		this.editLinkUrl = editLinkUrl;
		this.preferredLanguages = preferredLanguages;
	}
}
