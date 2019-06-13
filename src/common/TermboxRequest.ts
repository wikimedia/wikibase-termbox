import TermboxLinks from '@/common/TermboxLinks';

export default class TermboxRequest {
	public readonly language: string;
	public readonly entityId: string;
	public readonly revision: number;
	public readonly links: TermboxLinks;
	public readonly preferredLanguages: string[];
	public readonly userName: string | null = null;

	public constructor(
		language: string,
		entityId: string,
		revision: number,
		links: TermboxLinks,
		preferredLanguages: string[],
		userName: string | null = null,
	) {
		this.language = language;
		this.entityId = entityId;
		this.revision = revision;
		this.links = links;
		this.preferredLanguages = preferredLanguages;
		this.userName = userName;
	}
}
