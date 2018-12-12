export interface WikibaseApiContentLanguages {
	[code: string]: {
		code: string,
		name: string,
	};
}

export default interface WikibaseContentLanguagesRepo {
	getContentLanguages( inLanguage: string|null ): Promise<WikibaseApiContentLanguages>;
}
