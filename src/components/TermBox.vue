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
							@click="saveOrShowLicenseAgreement"
							:message="message( MESSAGE_KEYS.PUBLISH )"
						/>
						<EventEmittingButton
							type="cancel"
							@click="cancel"
							:message="message( MESSAGE_KEYS.CANCEL )"
						/>
					</template>
				</EditTools>
				<Overlay v-if="showEditWarning">
					<Modal>
						<AnonEditWarning @dismiss="showEditWarning = false" />
					</Modal>
				</Overlay>
				<Overlay v-if="showLicenseAgreement">
					<Modal>
						<LicenseAgreement @cancel="closeLicenseAgreement()" @save="save()" />
					</Modal>
				</Overlay>
				<Overlay v-if="isSaving">
					<IndeterminateProgressBar />
				</Overlay>
				<MessageBanner v-if="showSavingError">
					<template #heading>
						{{ message( MESSAGE_KEYS.SAVE_ERROR_HEADING ) }}
					</template>
					<template #message>
						<IconMessageBox type="error">
							{{ message( MESSAGE_KEYS.SAVE_ERROR_MESSAGE ) }}
						</IconMessageBox>
					</template>
				</MessageBanner>
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
import LicenseAgreement from '@/components/LicenseAgreement.vue';
import { UserPreference } from '@/common/UserPreference';
import User from '@/store/user/User';
import { ConfigOptions } from '@/components/mixins/newConfigMixin';
import Overlay from '@/components/Overlay.vue';
import IndeterminateProgressBar from '@/components/IndeterminateProgressBar.vue';
import MessageBanner from '@/components/MessageBanner.vue';
import IconMessageBox from '@/components/IconMessageBox.vue';

@Component( {
	components: {
		IconMessageBox,
		MessageBanner,
		IndeterminateProgressBar,
		Overlay,
		AnonEditWarning,
		LicenseAgreement,
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

	@namespace( NS_USER ).Getter( 'isAnonymous' )
	public userIsAnonymous!: boolean;

	@namespace( NS_USER ).State( ( state: User ) => state.preferences[ UserPreference.HIDE_ANON_EDIT_WARNING ] )
	public hideAnonEditWarning!: boolean;

	@namespace( NS_USER ).State( ( state: User ) => state.preferences[ UserPreference.ACKNOWLEDGED_COPYRIGHT_VERSION ] )
	public acknowledgedCopyrightVersion!: string;

	private config!: ConfigOptions;

	public showEditWarning = false;

	public showLicenseAgreement = false;

	public isSaving = false;

	public showSavingError = false;

	public edit() {
		if ( !this.hideAnonEditWarning ) {
			this.showEditWarningForAnonymousUser();
		}

		this.activateEditMode();
	}

	public saveOrShowLicenseAgreement(): void {
		if ( this.acknowledgedCopyrightVersion && this.acknowledgedCopyrightVersion === this.config.copyrightVersion ) {
			this.save();
		} else {
			this.showLicenseAgreement = true;
		}
	}

	public save(): void {
		this.isSaving = true;
		this.closeLicenseAgreement();
		this.saveEntity()
			.then( () => {
				this.deactivateEditModeAndDismissErrors();
			} )
			.catch( () => {
				this.showSavingError = true;
			} )
			.finally( () => {
				this.isSaving = false;
			} );
	}

	private deactivateEditModeAndDismissErrors() {
		this.showSavingError = false;
		this.deactivateEditMode();
	}

	public closeLicenseAgreement() {
		this.showLicenseAgreement = false;
	}

	public cancel(): void {
		this.rollbackEntity()
			.then( () => {
				this.deactivateEditModeAndDismissErrors();
			} );
	}

	public showEditWarningForAnonymousUser() {
		this.showEditWarning = this.userIsAnonymous;
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
