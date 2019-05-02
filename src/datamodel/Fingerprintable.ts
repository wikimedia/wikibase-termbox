import TermList from '@/datamodel/TermList';
import AliasesList from '@/datamodel/AliasesList';

interface Fingerprintable {
	labels: TermList;
	descriptions: TermList;
	aliases: AliasesList;
}

export default Fingerprintable;
