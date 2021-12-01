import { defineComponent } from 'vue';
import { MessageKey } from '@/common/MessageKey';
import { NS_MESSAGES, NS_USER } from '@/store/namespaces';
import {
	mapGetters,
	mapState,
} from 'vuex';

interface Messages {
	getMessageInLanguage: ( inLanguage: string, messageKey: MessageKey ) => string | null;
	primaryLanguage: string;
}

export default defineComponent( {
	name: 'Messages',
	computed: {
		MESSAGE_KEYS() {
			return MessageKey;
		},
		...mapGetters( NS_MESSAGES, [ 'getMessageInLanguage' ] ),
		...mapState( NS_USER, [ 'primaryLanguage' ] ),
	},
	methods: {
		message( this: Messages, messageKey: MessageKey ): string {
			const messageContent = this.getMessageInLanguage(
				this.primaryLanguage,
				messageKey,
			);

			if ( messageContent === null ) {
				return messageKey;
			} else {
				return messageContent;
			}
		},
	},
} );
