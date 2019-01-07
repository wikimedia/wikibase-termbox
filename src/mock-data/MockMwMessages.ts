import * as messages from './data/de_messages_data.json';

export function message( key: string ) {
	return {
		text() {
			return messages.default[ key ];
		},
	};
}
