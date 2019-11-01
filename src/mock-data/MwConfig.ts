export default class MwConfig {
	private language: string;

	public constructor( language: string ) {
		this.language = language;
	}

	public get( key: string ): unknown {
		const config: { [ index: string ]: unknown } = {
			wgUserLanguage: this.language,
			wbEntityId: 'Q64',
			wgRevisionId: 0,
			wgNamespaceIds: { special: -1 },
			wgRelevantPageIsProbablyEditable: true,
			wbIsEditView: true,
			wbRepo: {
				scriptPath: '/csrMWProxy',
			},
			wgUserName: null,
			wbMultiLingualStringLimit: 250,
			wbCopyright: {
				messageHtml: `By clicking "publish", you agree to the
			<a href="https://wikidata.beta.wmflabs.org/w/index.php?
			title=Wikidata:Copyrights&amp;action=edit&amp;redlink=1"
			title="Wikidata:Copyrights (page does not exist)">terms of use</a>,
			and you irrevocably agree to release your contribution under the <a
			href="https://creativecommons.org/publicdomain/zero/1.0/"
			class="external">Creative Commons CC0 License</a>.`,
				version: 'wikibase-1',
			},
		};

		return config[ key ];
	}
}
