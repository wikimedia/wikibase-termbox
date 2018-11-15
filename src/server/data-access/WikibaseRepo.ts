import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

/**
 * Rejects to TechnicalProblem or EntityNotFound errors in case of problems
 */
export default interface WikibaseRepo {
	getFingerprintableEntity( id: string ): Promise<FingerprintableEntity>;
}
