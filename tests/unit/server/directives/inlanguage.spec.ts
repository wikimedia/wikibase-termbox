import inlanguage from '@/server/directives/inlanguage';
import Language from '@/datamodel/Language';
import { VNode } from 'vue';
import { getter } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import { NS_LANGUAGE } from '@/store/namespaces';

describe( 'inlanguage directive', () => {
	it( 'adds language properties to element\'s attributes', () => {
		const languageCode = 'de';
		const language: Language = { code: languageCode, directionality: 'ltr' };
		const mockGetter = jest.fn().mockImplementation( ( _code: string ) => language );
		const vnode: VNode = {
			data: {
				attrs: {
					prexisting: 'yes',
				},
			},
			isRootInsert: false,
			isComment: false,
			context: {
				$store: {
					getters: {
						[ getter( NS_LANGUAGE, 'getByCode' ) ]: mockGetter,
					},
				},
			} as any,
		};

		inlanguage( vnode, {
			name: 'inlanguage',
			value: languageCode,
		} );

		expect( mockGetter ).toHaveBeenCalledWith( languageCode );
		expect( vnode!.data!.attrs ).toEqual( {
			lang: language.code,
			dir: language.directionality,
			prexisting: 'yes',
		} );
	} );
} );
