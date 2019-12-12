import LanguageTranslationRepository from '@/common/data-access/LanguageTranslationRepository';
import EntityRepository from '@/common/data-access/EntityRepository';
import LanguageRepository from '@/common/data-access/LanguageRepository';
import MessagesRepository from '@/common/data-access/MessagesRepository';
import EntityEditabilityResolver from '@/common/data-access/EntityEditabilityResolver';
import WritingEntityRepository from '@/common/data-access/WritingEntityRepository';
import UserPreferenceRepository from '@/common/data-access/UserPreferenceRepository';

export interface Services {
	languageTranslationRepository: LanguageTranslationRepository;
	languageRepository: LanguageRepository;
	entityRepository: EntityRepository;
	messagesRepository: MessagesRepository;
	entityEditabilityResolver: EntityEditabilityResolver;
	writingEntityRepository: WritingEntityRepository;
	userPreferenceRepository: UserPreferenceRepository;
}

export default class TermboxServices {
	private readonly services: Partial<Services>;

	public constructor() {
		this.services = {};
	}

	public set<K extends keyof Services>( key: K, service: Services[ K ] ): void {
		this.services[ key ] = service;
	}

	public get<K extends keyof Services>( key: K ): Services[ K ] {
		if ( this.services[ key ] === undefined ) {
			throw new Error( `${key} is undefined` );
		}

		return this.services[ key ] as Services[ K ];
	}
}
