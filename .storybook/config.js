import {
	addDecorator,
	configure,
} from '@storybook/vue';
import '@/client/directives';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator( withKnobs );

const req = require.context( '../stories', true, /\.js$/ );
function loadStories() {
	req.keys().forEach( ( filename ) => req( filename ) );
}

configure( loadStories, module );
