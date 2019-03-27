import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import EntityRevision from '@/datamodel/EntityRevision';

export default interface WritingEntityRepository {

	/**
	 * Rejects to TechnicalProblem or EntityNotFound errors in case of problems
	 */
	saveEntity( entity: FingerprintableEntity, baseRevId: number ): Promise<EntityRevision>;

}
