<template>
	<div class="wb-ui-termbox">
		<div class="wb-ui-termbox__primary">
			<MonolingualFingerprintView
				class="wb-ui-termbox__primary-inner"
				:language-code="primaryLanguage"
				:is-primary="true"
			/>
			<div class="wb-ui-termbox__actions">
				<EditTools v-if="isEditable" :edit-mode="editMode">
					<EditPen slot="read" @editing="activateEditMode" :href="editLinkUrl" />
					<template slot="edit">
						<Publish @publish="publish" />
						<Cancel @cancel="cancel" />
					</template>
				</EditTools>
			</div>
		</div>

		<InMoreLanguagesExpandable />
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
import Cancel from '@/components/Cancel.vue';
import MonolingualFingerprintView from '@/components/MonolingualFingerprintView.vue';
import InMoreLanguagesExpandable from '@/components/InMoreLanguagesExpandable.vue';
import { Action, namespace } from 'vuex-class';
import { ENTITY_SAVE } from '@/store/entity/actionTypes';
import { EDITMODE_ACTIVATE, EDITMODE_DEACTIVATE } from '@/store/actionTypes';

@Component( {
	components: {
		InMoreLanguagesExpandable,
		MonolingualFingerprintView,
		EditTools,
		EditPen,
		Publish,
		Cancel,
	},
	computed: {
		...mapState( [ 'editMode' ] ),
		...mapState( NS_LINKS, [ 'editLinkUrl' ] ),
		...mapState( NS_USER, [ 'primaryLanguage' ] ),
		...mapState( NS_ENTITY, [ 'isEditable' ] ),
	},
} )
export default class TermBox extends Vue {

	@Action( EDITMODE_ACTIVATE )
	public activateEditMode!: () => Promise<void>;

	@Action( EDITMODE_DEACTIVATE )
	public deactivateEditMode!: () => Promise<void>;

	@namespace( NS_ENTITY ).Action( ENTITY_SAVE )
	public saveEntity!: () => Promise<void>;

	public publish(): void {
		this.saveEntity()
			.then( () => {
				this.deactivateEditMode();
			} );
	}

	public cancel(): void {
		/* TODO rollback */
		this.deactivateEditMode();
	}

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
