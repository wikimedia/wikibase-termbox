import Language from '@/datamodel/Language';
import { DirectiveBinding } from '@vue/runtime-core';
import { getter } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import { NS_LANGUAGE } from '@/store/namespaces';

export default function inlanguage( el: HTMLElement, binding: DirectiveBinding ): void {
	if ( !binding.value ) {
		return;
	}
	if ( !binding.instance || !binding.instance.$store ) {
		return;
	}

	const languageCode: string = binding.value;
	const language: Language | null = binding.instance.$store
		.getters[ getter( NS_LANGUAGE, 'getByCode' ) ]( languageCode );

	if ( language ) {
		el.setAttribute( 'lang', language.code );
		el.setAttribute( 'dir', language.directionality );
	}
}
