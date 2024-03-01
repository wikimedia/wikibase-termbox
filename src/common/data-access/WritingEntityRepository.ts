import FingerprintableEntity from '@/datamodel/FingerprintableEntity';
import EntityRevisionWithRedirect from '@/datamodel/EntityRevisionWithRedirect';

interface WritingEntityRepository {

	/**
	 * Rejects to TechnicalProblem or EntityNotFound errors in case of problems
	 */
	saveEntity( entity: FingerprintableEntity, baseRevId: number ): Promise<EntityRevisionWithRedirect>;

}

export default WritingEntityRepository;
