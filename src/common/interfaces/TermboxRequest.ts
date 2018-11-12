import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

export default interface TermboxRequest {
	getLanguage(): string;
	getEntity(): FingerprintableEntity;
}
