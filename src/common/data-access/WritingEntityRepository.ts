import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

export default interface WritingEntityRepository {

	/**
	 * Rejects to TechnicalProblem or EntityNotFound errors in case of problems
	 */
	saveEntity( entity: FingerprintableEntity, baseRevId: number ): Promise<void>;

}
