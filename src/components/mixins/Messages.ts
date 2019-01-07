import Vue, { VueConstructor } from 'vue';
import Component from 'vue-class-component';
import { MessageKeys } from '@/common/MessageKeys';
import {
	NS_USER,
	NS_MESSAGES,
} from '@/store/namespaces';
import {
	mapState,
	mapGetters,
} from 'vuex';

export interface MessagesMixin extends Vue {
	getMessageInLanguage: ( inLanguage: string, messageKey: string ) => string | null;
	primaryLanguage: string;
	MESSAGE_KEYS: typeof MessageKeys;
	message( messageKey: string ): string;
}

@Component( {
	computed: {
		...mapGetters( NS_MESSAGES, { getMessageInLanguage: 'getMessageInLanguage' } ),
		...mapState( NS_USER, [ 'primaryLanguage' ] ),
	},
} )
export default class Messages extends ( Vue as VueConstructor<MessagesMixin> ) {
	public readonly MESSAGE_KEYS = MessageKeys;

	public message( messageKey: string ): string {
		const messageContent = this.getMessageInLanguage(
			this.primaryLanguage,
			messageKey,
		);

		if ( messageContent === null ) {
			return messageKey;
		} else {
			return messageContent;
		}
	}
}
