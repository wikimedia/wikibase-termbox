import TermList from '@/datamodel/TermList';
import AliasesList from '@/datamodel/AliasesList';

export default interface Entity {
	id: string;
	baseRevision: number;

	labels: TermList;
	descriptions: TermList;
	aliases: AliasesList;

	isEditable: boolean;
}
