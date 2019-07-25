import { configure } from '@storybook/vue';
import '@/client/directives';

const req = require.context( '../stories', true, /\.js$/ );
function loadStories() {
	req.keys().forEach( ( filename ) => req( filename ) );
}

configure( loadStories, module );
