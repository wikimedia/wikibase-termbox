import TermboxLinks from '@/common/TermboxLinks';

export default class TermboxRequest {
	public readonly language: string;
	public readonly entityId: string;
	public readonly revision: number;
	public readonly links: TermboxLinks;
	public readonly preferredLanguages: string[];

	constructor(
		language: string,
		entityId: string,
		revision: number,
		links: TermboxLinks,
		preferredLanguages: string[],
	) {
		this.language = language;
		this.entityId = entityId;
		this.revision = revision;
		this.links = links;
		this.preferredLanguages = preferredLanguages;
	}
}
