import TermList from '@/datamodel/TermList';
import AliasesList from '@/datamodel/AliasesList';
import Fingerprintable from '@/datamodel/Fingerprintable';

export default class FingerprintableEntity implements Fingerprintable {
	public readonly id: string;
	public readonly labels: TermList;
	public readonly descriptions: TermList;
	public readonly aliases: AliasesList;

	public constructor(
		id: string,
		labels: TermList,
		descriptions: TermList,
		aliases: AliasesList,
	) {
		this.id = id;
		this.labels = labels;
		this.descriptions = descriptions;
		this.aliases = aliases;
	}

}
