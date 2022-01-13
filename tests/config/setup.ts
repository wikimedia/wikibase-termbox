import Vue from 'vue';
import focus from '@/client/directives/focus';
import inlanguage from '@/client/directives/inlanguage';
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
