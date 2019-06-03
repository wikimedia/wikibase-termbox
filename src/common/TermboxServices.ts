import LanguageTranslationRepository from '@/common/data-access/LanguageTranslationRepository';
import EntityRepository from '@/common/data-access/EntityRepository';
import LanguageRepository from '@/common/data-access/LanguageRepository';
import MessagesRepository from '@/common/data-access/MessagesRepository';
import EntityEditabilityResolver from '@/common/data-access/EntityEditabilityResolver';
import WritingEntityRepository from '@/common/data-access/WritingEntityRepository';
import UserPreferenceRepository from '@/common/data-access/UserPreferenceRepository';

export default class TermboxServices {
	private languageTranslationRepository?: LanguageTranslationRepository;
	private languageRepository?: LanguageRepository;
	private entityRepository?: EntityRepository;
	private messagesRepository?: MessagesRepository;
	private entityEditabilityResolver?: EntityEditabilityResolver;
	private writingEntityRepository?: WritingEntityRepository;
	private userPreferenceRepository?: UserPreferenceRepository;

	public setLanguageTranslationRepository( lookup: LanguageTranslationRepository ) {
		this.languageTranslationRepository = lookup;
	}

	public getLanguageTranslationRepository() {
		if ( this.languageTranslationRepository ) {
			return this.languageTranslationRepository;
		} else {
			throw new Error( 'languageTranslationRepository is undefined' );
		}
	}

	public setLanguageRepository( languageRepository: LanguageRepository ) {
		this.languageRepository = languageRepository;
	}

	public getLanguageRepository() {
		if ( this.languageRepository ) {
			return this.languageRepository;
		} else {
			throw new Error( 'languageRepository is undefined' );
		}
	}

	public setEntityRepository( lookup: EntityRepository ) {
		this.entityRepository = lookup;
	}

	public getEntityRepository() {
		if ( this.entityRepository ) {
			return this.entityRepository;
		} else {
			throw new Error( 'entityRepository is undefined' );
		}
	}

	public setMessagesRepository( lookup: MessagesRepository ) {
		this.messagesRepository = lookup;
	}

	public getMessagesRepository() {
		if ( this.messagesRepository ) {
			return this.messagesRepository;
		} else {
			throw new Error( 'messagesRepository is undefined' );
		}
	}

	public setEntityEditabilityResolver( editabilityResolver: EntityEditabilityResolver ) {
		this.entityEditabilityResolver = editabilityResolver;
	}

	public getEntityEditabilityResolver() {
		if ( this.entityEditabilityResolver ) {
			return this.entityEditabilityResolver;
		} else {
			throw new Error( 'entityEditabilityResolver is undefined' );
		}
	}

	public setWritingEntityRepository( writingEntityRepository: WritingEntityRepository ) {
		this.writingEntityRepository = writingEntityRepository;
	}

	public getWritingEntityRepository() {
		if ( this.writingEntityRepository ) {
			return this.writingEntityRepository;
		} else {
			throw new Error( 'writingEntityRepository is undefined' );
		}
	}

	public setUserPreferenceRepository( userPreferenceRepository: UserPreferenceRepository ) {
		this.userPreferenceRepository = userPreferenceRepository;
	}

	public getUserPreferenceRepository() {
		if ( this.userPreferenceRepository ) {
			return this.userPreferenceRepository;
		} else {
			throw new Error( 'userPreferenceRepository is undefined' );
		}
	}

}

const services = new TermboxServices();

export {
	services,
};
