<template>
	<div class="wb-ui-termbox">
		<div class="wb-ui-termbox__layout">
			<div class="wb-ui-termbox__content">
				<div class="wb-ui-termbox__primary">
					<MonolingualFingerprintView
						class="wb-ui-termbox__primary-inner"
						:language-code="primaryLanguage"
						:is-primary="true"
					/>
				</div>

				<InMoreLanguagesExpandable />
			</div>
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
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
	mapActions,
	mapGetters,
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

export default defineComponent( {
	name: 'TermBox',
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
	mixins: [ Messages ],
	data() {
		return {
			showEditWarning: false,
			showLicenseAgreement: false,
			isSaving: false,
			showSavingError: false,
		};
	},
	computed: {
		...mapState( [ 'editMode' ] ),
		...mapState( NS_LINKS, [ 'editLinkUrl' ] ),
		...mapState( NS_USER, [ 'primaryLanguage' ] ),
		...mapState( NS_ENTITY, [ 'isEditable' ] ),
		...mapGetters( NS_USER, { userIsAnonymous: 'isAnonymous' } ),
	},
	methods: {
		...mapActions( {
			activateEditMode: EDITMODE_ACTIVATE,
			deactivateEditMode: EDITMODE_DEACTIVATE,
		} ),
		...mapActions( NS_ENTITY, {
			saveEntity: ENTITY_SAVE,
			rollbackEntity: ENTITY_ROLLBACK,
		} ),
		edit(): void {
			if ( !( this.$store.state[ NS_USER ] as User ).preferences[ UserPreference.HIDE_ANON_EDIT_WARNING ] ) {
				this.showEditWarningForAnonymousUser();
			}

			this.activateEditMode();
		},
		saveOrShowLicenseAgreement(): void {
			const acknowledgedCopyrightVersion = ( this.$store.state[ NS_USER ] as User )
				.preferences[ UserPreference.ACKNOWLEDGED_COPYRIGHT_VERSION ];
			const config = ( this as unknown as { config: ConfigOptions } ).config;
			if (
				acknowledgedCopyrightVersion &&
				acknowledgedCopyrightVersion === config.copyrightVersion
			) {
				this.save();
			} else {
				this.showLicenseAgreement = true;
			}
		},
		save(): void {
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
		},
		deactivateEditModeAndDismissErrors(): void {
			this.showSavingError = false;
			this.deactivateEditMode();
		},
		closeLicenseAgreement(): void {
			this.showLicenseAgreement = false;
		},
		cancel(): void {
			this.rollbackEntity()
				.then( () => {
					this.deactivateEditModeAndDismissErrors();
				} );
		},
		showEditWarningForAnonymousUser(): void {
			this.showEditWarning = this.userIsAnonymous;
		},
	},
} );
</script>

<style lang="scss">
.wb-ui-termbox {
	&__layout {
		display: flex;
	}

	&__content {
		@include shrinking-flex-element();
		flex: 1;
	}

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
</style>
