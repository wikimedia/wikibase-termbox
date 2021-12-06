import LanguageRepository from '@/common/data-access/LanguageRepository';
import LanguageCollection from '@/datamodel/LanguageCollection';
import Language from '@/datamodel/Language';
import { WikibaseContentLanguages, UlsData } from '@/client/mediawiki/MwWindow';

export default class UlsLanguageRepository implements LanguageRepository {

	private contentLanguages: WikibaseContentLanguages;
	private directionalities: UlsData;

	public constructor( contentLanguages: WikibaseContentLanguages, directionalities: UlsData ) {
		this.contentLanguages = contentLanguages;
		this.directionalities = directionalities;
	}

	public getLanguages(): Promise<LanguageCollection> {
		return Promise.resolve( this.getLanguageCollection() );
	}

	private getLanguageCollection(): LanguageCollection {
		const codes = this.getLanguageCodes();
		const collection: LanguageCollection = {};
		codes.forEach( ( code ) => {
			collection[ code ] = this.getDirectionalityByKey( code );
		} );
		return collection;
	}

	private getLanguageCodes(): string[] {
		return Object.keys(
			this.contentLanguages.getLanguageNameMap(),
		);
	}

	private getDirectionalityByKey( languageCode: string ): Language {
		return {
			code: languageCode,
			directionality: this.directionalities.getDir( languageCode ),
		};
	}
}
