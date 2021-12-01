<template>
	<Sectionedit>
		<slot name="edit" v-if="editMode" />
		<slot name="read" v-else />
	</Sectionedit>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Sectionedit from './Sectionedit.vue';

export default defineComponent( {
	name: 'EditTools',
	components: {
		Sectionedit,
	},
	props: {
		editMode: { required: true, type: Boolean },
	},
} );
</script>
