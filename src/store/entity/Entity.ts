import TermList from '@/datamodel/TermList';
import AliasesList from '@/datamodel/AliasesList';

export default interface Entity {
	id: string;
	labels: TermList;
	descriptions: TermList;
	aliases: AliasesList;
}
