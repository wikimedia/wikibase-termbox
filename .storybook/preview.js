import {
	addDecorator,
	addParameters,
} from '@storybook/vue';
import focus from '@/directives/focus';
import inlanguage from '@/directives/inlanguage';
import { withKnobs } from '@storybook/addon-knobs';
import Vue from 'vue';

Vue.directive( 'inlanguage', inlanguage );
Vue.directive( 'focus', focus );

addDecorator( withKnobs );

addParameters( {
	docs: {
		inlineStories: true,
	},
} );
