export default class MWConfig {
	public get( key: string ): any {
		const config: { [ index: string ]: any } = {
			wgUserLanguage: ( new URLSearchParams( location.search ) ).get( 'uselang' ) || 'de',
			wbEntityId: 'Q64',
			wgNamespaceIds: { special: -1 },
		};

		return config[ key ];
	}
}
