export default class MWConfig {
	public get( key: string ): string {
		const config: { [ index: string ]: string } = {
			wgUserLanguage: 'de',
			wbEntityId: 'Q64',
		};

		return config[ key ];
	}
}
