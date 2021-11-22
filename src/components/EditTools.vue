<template>
	<Sectionedit>
		<slot name="edit" v-if="editMode" />
		<slot name="read" v-else />
	</Sectionedit>
</template>

<script lang="ts">
import Vue from 'vue';
import Sectionedit from './Sectionedit.vue';

export default Vue.extend( {
	name: 'EditTools',
	components: {
		Sectionedit,
	},
	props: {
		editMode: { required: true, type: Boolean },
	},
} );
</script>
