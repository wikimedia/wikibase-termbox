<template>
	<Sectionedit>
		<slot name="edit" v-if="editMode" />
		<slot name="read" v-else />
	</Sectionedit>
</template>

<script lang="ts">
import Vue from 'vue';
import Sectionedit from './Sectionedit.vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component( {
	components: {
		Sectionedit,
	},
} )
export default class EditTools extends Vue {
	@Prop( { required: true, type: Boolean } )
	public editMode!: boolean;
}
</script>
