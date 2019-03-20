export default class MWConfig {
	private language: string;

	public constructor( language: string ) {
		this.language = language;
	}

	public get( key: string ): any {
		const config: { [ index: string ]: any } = {
			wgUserLanguage: this.language,
			wbEntityId: 'Q64',
			wgRevisionId: 4711,
			wgNamespaceIds: { special: -1 },
			wgRelevantPageIsProbablyEditable: true,
			wbIsEditView: true,
		};

		return config[ key ];
	}
}
