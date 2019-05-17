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
					<template #read>
						<EventEmittingButton
							type="edit"
							@click="edit"
							:href="editLinkUrl"
							:message="message( MESSAGE_KEYS.EDIT )"
						/>
					</template>
					<template #edit>
						<EventEmittingButton
							type="publish"
							@click="publish"
							:message="message( MESSAGE_KEYS.PUBLISH )"
						/>
						<EventEmittingButton
							type="cancel"
							@click="cancel"
							:message="message( MESSAGE_KEYS.CANCEL )"
						/>
					</template>
				</EditTools>
				<Modal v-if="showEditWarning">
					<AnonEditWarning @dismiss="showEditWarning = false" />
				</Modal>
			</div>
		</div>

		<InMoreLanguagesExpandable />
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import {
	mapState,
} from 'vuex';
import {
	NS_ENTITY,
	NS_LINKS,
	NS_USER,
} from '@/store/namespaces';
import EditTools from '@/components/EditTools.vue';
import MonolingualFingerprintView from '@/components/MonolingualFingerprintView.vue';
import InMoreLanguagesExpandable from '@/components/InMoreLanguagesExpandable.vue';
import { Action, namespace } from 'vuex-class';
import { ENTITY_SAVE, ENTITY_ROLLBACK } from '@/store/entity/actionTypes';
import { EDITMODE_ACTIVATE, EDITMODE_DEACTIVATE } from '@/store/actionTypes';
import EventEmittingButton from '@/components/EventEmittingButton.vue';
import Messages from '@/components/mixins/Messages';
import Modal from '@/components/Modal.vue';
import AnonEditWarning from '@/components/AnonEditWarning.vue';

@Component( {
	components: {
		AnonEditWarning,
		Modal,
		EventEmittingButton,
		InMoreLanguagesExpandable,
		MonolingualFingerprintView,
		EditTools,
	},
	computed: {
		...mapState( [ 'editMode' ] ),
		...mapState( NS_LINKS, [ 'editLinkUrl' ] ),
		...mapState( NS_USER, [ 'primaryLanguage' ] ),
		...mapState( NS_ENTITY, [ 'isEditable' ] ),
	},
} )
export default class TermBox extends mixins( Messages ) {

	@Action( EDITMODE_ACTIVATE )
	public activateEditMode!: () => Promise<void>;

	@Action( EDITMODE_DEACTIVATE )
	public deactivateEditMode!: () => Promise<void>;

	@namespace( NS_ENTITY ).Action( ENTITY_SAVE )
	public saveEntity!: () => Promise<void>;

	@namespace( NS_ENTITY ).Action( ENTITY_ROLLBACK )
	public rollbackEntity!: () => Promise<void>;

	@namespace( NS_USER ).State( 'name' )
	public userName!: string | null;

	public showEditWarning = false;

	public edit() {
		this.showEditWarningForAnonymousUser();
		this.activateEditMode();
	}

	public publish(): void {
		this.saveEntity()
			.then( () => {
				this.deactivateEditMode();
			} );
	}

	public cancel(): void {
		this.rollbackEntity()
			.then( () => {
				this.deactivateEditMode();
			} );
	}

	public showEditWarningForAnonymousUser() {
		this.showEditWarning = this.userName === null;
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
