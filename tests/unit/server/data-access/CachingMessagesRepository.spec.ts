import CachingMessagesRepository from '@/server/data-access/CachingMessagesRepository';
import MessageTranslationCollection from '@/datamodel/MessageTranslationCollection';

class FakeCache {

	private contents: { [ key: string ]: any } = {};

	set( key: string, value: any ) {
		this.contents[ key ] = value;
	}

	get( key: string ) {
		return this.contents[ key ];
	}

}

describe( 'CachingMessagesRepository', () => {

	it( 'returns the cache content on a hit', () => {
		const language = 'en';
		const cache = new FakeCache();
		const cachedMessages: MessageTranslationCollection = {
			[ language ]: { 'some-message-key': 'some-message' },
		};
		cache.set( language, cachedMessages );
		const messageRepo = new CachingMessagesRepository( cache as any, new ( jest.fn() )() );

		return messageRepo.getMessagesInLanguage( language ).then( ( messages ) => {
			expect( messages ).toBe( cachedMessages );
		} );
	} );

	it( 'delegates to its decoratee on a miss and sets the cache value', () => {
		const language = 'en';
		const expectedMessages: MessageTranslationCollection = {
			[ language ]: { 'some-message-key': 'some-message' },
		};
		const cache = { set: jest.fn(), get: () => undefined };
		const messageRepo = {
			getMessagesInLanguage: jest.fn(),
		};
		messageRepo.getMessagesInLanguage.mockResolvedValue( expectedMessages );
		const cachingMessageRepo = new CachingMessagesRepository( cache as any, messageRepo );

		return cachingMessageRepo.getMessagesInLanguage( language ).then( ( messages ) => {
			expect( messages ).toBe( expectedMessages );
			expect( messageRepo.getMessagesInLanguage ).toHaveBeenCalledWith( language );
			expect( cache.set ).toHaveBeenCalledWith( language, expectedMessages );
		} );
	} );

} );
