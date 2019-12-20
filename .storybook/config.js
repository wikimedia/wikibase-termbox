import {
	addDecorator,
	configure,
} from '@storybook/vue';
import '@/client/directives';
import { withInfo } from 'storybook-addon-vue-info';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator( withKnobs );
addDecorator( withInfo );

const req = require.context( '../stories', true, /\.js$/ );
function loadStories() {
	req.keys().forEach( ( filename ) => req( filename ) );
}

configure( loadStories, module );
