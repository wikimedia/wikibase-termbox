import {
	addDecorator,
	addParameters,
	app,
} from '@storybook/vue3';
import focus from '@/directives/focus';
import inlanguage from '@/directives/inlanguage';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator( withKnobs );
app.directive( 'focus', focus );
app.directive( 'inlanguage', inlanguage );

addParameters( {
	docs: {
		inlineStories: true,
	},
} );
