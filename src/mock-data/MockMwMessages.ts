import * as Messages from './data/de_messages_data.json';

export default class MockMwMessages {
	public static message( key: string ) {
		return {
			text() {
				return MockMwMessages.messages[ key ];
			},
		};
	}

	private static messages = Messages.default;
}
