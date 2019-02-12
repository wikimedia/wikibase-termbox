import Vue from 'vue';
import Component from 'vue-class-component';
import { MessageKeys } from '@/common/MessageKeys';
import { NS_MESSAGES, NS_USER } from '@/store/namespaces';
import { namespace } from 'vuex-class';

@Component
export default class Messages extends Vue {
	public readonly MESSAGE_KEYS = MessageKeys;

	@namespace( NS_MESSAGES ).Getter( 'getMessageInLanguage' )
	public getMessageInLanguage!: ( inLanguage: string, messageKey: string ) => string | null;

	@namespace( NS_USER ).State( 'primaryLanguage' )
	public primaryLanguage!: string;

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
