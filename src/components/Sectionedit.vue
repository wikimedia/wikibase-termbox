<template>
	<wb:sectionedit v-if="isServer">
		<div><!-- the else needs a wrapping element around slot so we add it here, too for identical mark-up -->
			<slot></slot>
		</div>
	</wb:sectionedit>
	<div v-else>
		<slot></slot>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

// wikibase' custom tag to show/hide wrapped content depending on editability
Vue.config.ignoredElements.push( 'wb:sectionedit' );

@Component( {
	props: {
		forceServer: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
} )
export default class Sectionedit extends Vue {
	private forceServer?: boolean;

	get isServer() {
		if ( this.forceServer ) {
			return true;
		}

		return this.$isServer;
	}
}
</script>


<style lang="scss">
</style>
