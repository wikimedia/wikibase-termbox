import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

export default interface EntityRepository {
	/**
	 * Rejects to TechnicalProblem or EntityNotFound errors in case of problems
	 */
	getFingerprintableEntity( id: string ): Promise<FingerprintableEntity>;
}
