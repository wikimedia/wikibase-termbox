import Vue from 'vue';
import App from '@/components/App.vue';

Vue.config.productionTip = false;

const app = new App();

export default ( context: object ) => {
	// Setting the data here is a bit silly, and should be considered more of a proof of concept.
	// The better way is likely to fill the store with data from the context object instead.
	Object.entries( context )
		.forEach( ( [key, value] ) => app.$data[key] = value );

	return app;
};
