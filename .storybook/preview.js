import {
	addDecorator,
	addParameters,
} from '@storybook/vue';
import '@/client/directives';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator( withKnobs );

addParameters( {
	docs: {
		inlineStories: true,
	},
} );
