import Language from '@/datamodel/Language';
import { DirectiveBinding } from 'vue/types/options';
import { VNode } from 'vue/types/vnode';
import { getter } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import { NS_LANGUAGE } from '@/store/namespaces';

export default function inlanguage( el: HTMLElement, binding: DirectiveBinding, vnode: VNode ) {
	if ( !binding.value ) {
		return;
	}
	if ( !vnode.context || !vnode.context.$store ) {
		return;
	}

	const languageCode: string = binding.value;
	const language: Language | null = vnode.context.$store
		.getters[ getter( NS_LANGUAGE, 'getByCode' ) ]( languageCode );

	if ( language ) {
		el.setAttribute( 'lang', language.code );
		el.setAttribute( 'dir', language.directionality );
	}
}
