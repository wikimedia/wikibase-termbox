export interface WikibaseApiContentLanguages {
	[code: string]: {
		code: string;
		name: string;
	};
}

interface WikibaseContentLanguagesRepo {
	getContentLanguages( inLanguage: string|null ): Promise<WikibaseApiContentLanguages>;
}

export default WikibaseContentLanguagesRepo;
