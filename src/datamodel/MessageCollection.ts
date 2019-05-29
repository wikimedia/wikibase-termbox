import { MessageKeys } from '@/common/MessageKeys';

type MessageCollection = {
	[ key in MessageKeys ]?: string;
}

export default MessageCollection;
