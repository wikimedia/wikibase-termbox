export default class MWConfig {
	public get( key: string ): string {
		const config: { [ index: string]: string } = {
			wgUserLanguage: 'de',
		};

		return config[ key ];
	}
}
