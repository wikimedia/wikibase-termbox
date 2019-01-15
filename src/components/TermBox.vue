<template>
	<div class="wikibase-termbox">
		<div class="wikibase-termbox__primary">
			<Fingerprint :language="primaryLanguage" :isPrimary="true" />
			<div class="wikibase-termbox__actions">
				<EditPen :href="editLinkUrl" v-if="isEditable"></EditPen>
			</div>
		</div>

		<AllEnteredLanguages/>
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
import EditPen from '@/components/EditPen.vue';
import Fingerprint from '@/components/Fingerprint.vue';
import AllEnteredLanguages from '@/components/AllEnteredLanguagesExpandable.vue';

@Component( {
	components: { AllEnteredLanguages, Fingerprint, EditPen },
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
.wikibase-termbox { // container - need a strong selector chain to reliably override reset css

	.wikibase-termbox { // for use as a prefix
		&__primary {
			display: flex;
		}

		&__actions {
			margin-left: auto;
			padding-left: 16px; // minimum horizontal separation between "interaction bar" and other content
			// TODO: this is only here because the other pens don't have a width of 48px
			margin-right: -9px;
		}
	}
}
</style>
