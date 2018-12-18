export default class MockMwMessages {
	public static message( key: string ) {
		return {
			text() {
				return MockMwMessages.messages[ key ];
			},
		};
	}
	private static messages: any = {
		'wikibase-edit': 'bearbeiten',
	};
}
