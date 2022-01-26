<template>
	<!-- wikibase' custom tag to show/hide wrapped content depending on editability -->
	<component v-if="isServerRendered" :is="'wb:sectionedit'">
		<div>
			<!-- the else needs a wrapping element around slot so we add it here, too for identical mark-up -->
			<slot />
		</div>
	</component>
	<div v-else>
		<slot />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent( {
	name: 'Sectionedit',
	data() {
		return { isServerRendered: true };
	},
	mounted(): void {
		this.isServerRendered = false;
	},
} );
</script>
