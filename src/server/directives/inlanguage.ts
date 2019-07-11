import { VNode, VNodeDirective } from 'vue';
import Language from '@/datamodel/Language';
import { getters } from '@/store/util';
import { NS_LANGUAGE } from '@/store/namespaces';

export default function inlanguage( vnode: VNode, directiveMeta: VNodeDirective ) {
	if ( !directiveMeta.value ) {
		return;
	}
	if ( !vnode.context || !vnode.context.$store ) {
		return;
	}

	const languageCode: string = directiveMeta.value;
	const language: Language | null = vnode.context.$store
		.getters[ getters( NS_LANGUAGE, 'getByCode' ) ]( languageCode );

	if ( language && vnode.data ) {
		const attributes = vnode.data.attrs || {};
		vnode.data.attrs = {
			...attributes,
			lang: language.code,
			dir: language.directionality,
		};
	}
}
