import Vue from 'vue';
import focus from '@/directives/focus';
import inlanguage from '@/directives/inlanguage';
import newConfigMixin from '@/components/mixins/newConfigMixin';

beforeEach( () => {
	expect.hasAssertions();
} );

Vue.mixin( newConfigMixin( {
	textFieldCharacterLimit: 0,
	licenseAgreementInnerHtml: '',
	copyrightVersion: '',
} ) );
Vue.directive( 'inlanguage', inlanguage );
Vue.directive( 'focus', focus );
