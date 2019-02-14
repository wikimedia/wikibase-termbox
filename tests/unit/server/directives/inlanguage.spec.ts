import inlanguage from '@/server/directives/inlanguage';
import Language from '@/datamodel/Language';
import { VNode } from 'vue';

describe( 'inlanguage directive', () => {
	it( 'adds language properties to element\'s attributes', () => {
		const language: Language = { code: 'de', directionality: 'ltr' };
		const vnode: VNode = {
			data: {
				attrs: {
					prexisting: 'yes',
				},
			},
			isRootInsert: false,
			isComment: false,
		};

		inlanguage( vnode, {
			name: 'inlanguage',
			value: language,
		} );

		expect( vnode!.data!.attrs ).toEqual( {
			lang: language.code,
			dir: language.directionality,
			prexisting: 'yes',
		} );
	} );
} );
