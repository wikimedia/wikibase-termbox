import Vue from 'vue';
import Component from 'vue-class-component';
import { MessageKey } from '@/common/MessageKey';
import { NS_MESSAGES, NS_USER } from '@/store/namespaces';
import { namespace } from 'vuex-class';

@Component
export default class Messages extends Vue {
	public readonly MESSAGE_KEYS = MessageKey;

	@namespace( NS_MESSAGES ).Getter( 'getMessageInLanguage' )
	public getMessageInLanguage!: ( inLanguage: string, messageKey: MessageKey ) => string | null;

	@namespace( NS_USER ).State( 'primaryLanguage' )
	public primaryLanguage!: string;

	public message( messageKey: MessageKey ): string {
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
