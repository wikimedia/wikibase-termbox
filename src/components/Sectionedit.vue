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

// wikibase' custom tag to show/hide wrapped content depending on editability
if ( Vue.config.ignoredElements ) {
	Vue.config.ignoredElements.push( 'wb:sectionedit' );
} else {
	Vue.config.ignoredElements = [ 'wb:sectionedit' ];
}

export default Vue.extend( {
	name: 'Sectionedit',
	data() {
		return { isServerRendered: true };
	},
	beforeMount(): void {
		this.isServerRendered = false;
	},
} );
</script>
