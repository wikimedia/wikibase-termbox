export default class MwConfig {
	private language: string;

	public constructor( language: string ) {
		this.language = language;
	}

	public get( key: string ): any {
		const config: { [ index: string ]: any } = {
			wgUserLanguage: this.language,
			wbEntityId: 'Q64',
			wgRevisionId: 0,
			wgNamespaceIds: { special: -1 },
			wgRelevantPageIsProbablyEditable: true,
			wbIsEditView: true,
			wbRepo: {
				url: process.env.VUE_APP_WIKIBASE_REPO,
				scriptPath: '', // contained in the above
			},
			wgUserName: null,
		};

		return config[ key ];
	}
}
