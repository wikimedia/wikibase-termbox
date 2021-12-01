import { MessageKey } from '@/common/MessageKey';
import MessageCollection from '@/datamodel/MessageCollection';

export default function mockMessageMixin( messages: MessageCollection = {} ) {
	return {
		computed: {
			MESSAGE_KEYS() {
				return MessageKey;
			},
		},
		methods: {
			message( key: MessageKey ) {
				return messages[ key ] || '';
			},
		},
	};
}
