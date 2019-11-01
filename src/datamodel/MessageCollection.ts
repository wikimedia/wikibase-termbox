import { MessageKey } from '@/common/MessageKey';

type MessageCollection = {
	[ key in MessageKey ]?: string;
};

export default MessageCollection;
