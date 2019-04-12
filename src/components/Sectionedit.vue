<template>
	<wb:sectionedit v-if="isServerRendered">
		<div>
			<!-- the else needs a wrapping element around slot so we add it here, too for identical mark-up -->
			<slot />
		</div>
	</wb:sectionedit>
	<div v-else>
		<slot />
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

// wikibase' custom tag to show/hide wrapped content depending on editability
Vue.config.ignoredElements.push( 'wb:sectionedit' );

@Component( {
} )
export default class Sectionedit extends Vue {
	public isServerRendered = true;

	public beforeMount() {
		this.isServerRendered = false;
	}
}
</script>
