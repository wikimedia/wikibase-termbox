import * as messages from './data/de_messages_data.json';
import { MwMessage } from '@/client/mediawiki/MwWindow';

export function message( key: string ): MwMessage {
	return {
		text() {
			return messages.default[ key ];
		},
	};
}
