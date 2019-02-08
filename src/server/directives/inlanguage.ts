import { VNode, VNodeDirective } from 'vue';
import Language from '@/datamodel/Language';

export default function inlanguage( vnode: VNode, directiveMeta: VNodeDirective ) {
	const language: Language = directiveMeta.value;
	if ( language && vnode.data ) {
		const attributes = vnode.data.attrs || {};
		vnode.data.attrs = {
			...attributes,
			lang: language.code,
			dir: language.directionality,
		};
	}
}
