import Language from '../../datamodel/Language';
import { DirectiveBinding } from 'vue/types/options';

export default function inlanguage( el: HTMLElement, binding: DirectiveBinding ) {
	const language: Language = binding.value;
	el.setAttribute( 'lang', language.code );
	el.setAttribute( 'dir', language.directionality );
}
