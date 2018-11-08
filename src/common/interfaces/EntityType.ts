import Dictionary from '@/common/interfaces/Dictionary';

export default interface Entity {
	id: string;
	type: 'item' | 'property' | '';
	labels: Dictionary<string>;
	descriptions: Dictionary<string>;
	aliases: Dictionary<string[]>;
}
