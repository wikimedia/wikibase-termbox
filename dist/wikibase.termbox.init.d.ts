import { Fingerprintable, TermList, AliasesList } from '@wmde/wikibase-datamodel-types';
import { App } from '@vue/runtime-core';

interface FingerprintableEntity extends Fingerprintable {
    readonly id: string;
    readonly labels: TermList;
    readonly descriptions: TermList;
    readonly aliases: AliasesList;
}

interface EntityRepository {
    /**
     * Rejects to TechnicalProblem or EntityNotFound errors in case of problems
     */
    getFingerprintableEntity(id: string, revision: number): Promise<FingerprintableEntity>;
}

declare class EntityRevisionWithRedirect {
    readonly entity: FingerprintableEntity;
    readonly revisionId: number;
    readonly redirectUrl: string | undefined;
    constructor(entity: FingerprintableEntity, revisionId: number, redirectUrl?: string | undefined);
}

interface WritingEntityRepository {
    /**
     * Rejects to TechnicalProblem or EntityNotFound errors in case of problems
     */
    saveEntity(entity: FingerprintableEntity, baseRevId: number): Promise<EntityRevisionWithRedirect>;
}

type ConfigurableServices = {
    readingEntityRepository: EntityRepository;
    writingEntityRepository: WritingEntityRepository;
};
declare const _default: (consumerDefinedServices: ConfigurableServices, isEditable: boolean, tempUserEnabled: boolean) => Promise<App>;

interface LoggableError {
    getContext(): object;
}

declare class ContextError extends Error implements LoggableError {
    private context;
    constructor(message: string, context?: object);
    getContext(): object;
}

declare class TechnicalProblem extends ContextError {
}

export { EntityRepository, TechnicalProblem, WritingEntityRepository, _default as default };
