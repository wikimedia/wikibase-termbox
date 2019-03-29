<template>
	<div class="wb-ui-termbox">
		<div class="wb-ui-termbox__primary">
			<MonolingualFingerprintView
				class="wb-ui-termbox__primary-inner"
				:languageCode="primaryLanguage"
				:isPrimary="true"
				/>
			<div class="wb-ui-termbox__actions">
				<EditTools v-if="isEditable">
					<EditPen :href="editLinkUrl" slot="edit" />
					<Publish slot="publish" />
				</EditTools>
			</div>
		</div>

		<InMoreLanguagesExpandable/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {
	mapState,
} from 'vuex';
import {
	NS_ENTITY,
	NS_LINKS,
	NS_USER,
} from '@/store/namespaces';
import EditTools from '@/components/EditTools.vue';
import EditPen from '@/components/EditPen.vue';
import Publish from '@/components/Publish.vue';
import MonolingualFingerprintView from '@/components/MonolingualFingerprintView.vue';
import InMoreLanguagesExpandable from '@/components/InMoreLanguagesExpandable.vue';

@Component( {
	components: { InMoreLanguagesExpandable, MonolingualFingerprintView, EditTools, EditPen, Publish },
	computed: {
		...mapState( NS_LINKS, [ 'editLinkUrl' ] ),
		...mapState( NS_USER, [ 'primaryLanguage' ] ),
		...mapState( NS_ENTITY, [ 'isEditable' ] ),
	},
} )
export default class TermBox extends Vue {

}
</script>

<style lang="scss">
.wb-ui-termbox {
	&__primary {
		display: flex;
	}

	&__primary-inner {
		@include shrinking-flex-element();
	}

	&__actions {
		margin-left: auto;
		padding-left: 16px; // minimum horizontal separation between "interaction bar" and other content
		// TODO: this is only here because the other pens don't have a width of 48px
		margin-right: -9px;
	}
}
</style>
