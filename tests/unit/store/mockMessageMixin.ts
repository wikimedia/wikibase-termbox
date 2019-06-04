import { MessageKey } from '@/common/MessageKey';
import MessageCollection from '@/datamodel/MessageCollection';

export default function mockMessageMixin( messages: MessageCollection = {} ) {
	return {
		methods: {
			message( key: MessageKey ) {
				return messages[ key ] || '';
			},
		},
	};
}
