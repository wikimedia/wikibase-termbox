import {
	addDecorator,
	configure,
} from '@storybook/vue';
import '@/client/directives';
import { withInfo } from 'storybook-addon-vue-info';

addDecorator( withInfo );

const req = require.context( '../stories', true, /\.js$/ );
function loadStories() {
	req.keys().forEach( ( filename ) => req( filename ) );
}

configure( loadStories, module );
