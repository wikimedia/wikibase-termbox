<template>
	<div class="wb-ui-license-agreement" tabindex="-1" v-focus>
		<h4 class="wb-ui-license-agreement__heading">
			{{ message( MESSAGE_KEYS.LICENSE_HEADER ) }}
		</h4>
		<IconMessageBox
			type="warning"
			class="wb-ui-license-agreement__message"
			v-html="config.licenseAgreementInnerHtml"
		/>
		<p class="wb-ui-license-agreement__persist">
			<Checkbox v-model="doNotShowAgain" :label="message( MESSAGE_KEYS.LICENSE_AGREEMENT_ACCEPT_PERSIST )" />
		</p>
		<div class="wb-ui-license-agreement__button-group">
			<EventEmittingButton
				type="primaryProgressive"
				:message="message( MESSAGE_KEYS.PUBLISH )"
				@click="savePreferenceAndPublish"
			/>
			<EventEmittingButton
				type="normal"
				:message="message( MESSAGE_KEYS.CANCEL )"
				@click="$emit( 'cancel' )"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import Messages from '@/components/mixins/Messages';
import EventEmittingButton from '@/components/EventEmittingButton.vue';
import Checkbox from '@/components/Checkbox.vue';
import { namespace } from 'vuex-class';
import { NS_USER } from '@/store/namespaces';
import { USER_PREFERENCE_SET } from '@/store/user/actionTypes';
import { UserPreference } from '@/common/UserPreference';
import { ConfigOptions } from '@/components/mixins/newConfigMixin';
import IconMessageBox from '@/components/IconMessageBox.vue';

@Component( {
	components: { IconMessageBox, Checkbox, EventEmittingButton },
} )

export default class LicenseAgreement extends mixins( Messages ) {
	@namespace( NS_USER ).Action( USER_PREFERENCE_SET )
	public savePreference!: ( payload: { name: UserPreference, value: string | null } ) => Promise<void>;

	public doNotShowAgain = true;

	private config!: ConfigOptions;

	public savePreferenceAndPublish() {
		this.$emit( 'save' );
		this.savePreference( {
			name: UserPreference.ACKNOWLEDGED_COPYRIGHT_VERSION,
			value: this.doNotShowAgain ? this.config.copyrightVersion : null,
		} );
	}

	public mounted() {
		this.$el.querySelectorAll( '.wb-ui-license-agreement__message a' ).forEach( ( $link ) => {
			$link.setAttribute( 'target', '_blank' );

			// protect older browsers from a window.opener vulnerability: https://mathiasbynens.github.io/rel-noopener/
			$link.setAttribute( 'rel', `${ $link.getAttribute( 'rel' ) || '' } noopener noreferrer` );
		} );
	}

}
</script>

<style lang="scss">
.wb-ui-license-agreement {
	margin: 0 8px;

	&__heading {
		text-align: center;
		font-weight: bold;
		margin-top: 10px;
	}

	&__message .external {
		// The following compensates for styling originating from the MinervaNeue skin that got partially reset.
		// A better approach (e.g. whitelisting elements from resetting, see
		// https://gerrit.wikimedia.org/r/c/wikibase/termbox/+/518041) should be revisited should this codebase
		// become skin-agnostic.
		padding-right: 13px;
	}

	&__button-group {
		margin-top: 8px;

		> * {
			margin-top: 8px;

			&:not( :last-child ) {
				margin-right: 16px;
			}
		}
	}

	&:focus {
		outline: 0;
		border: 0;
	}

	&__persist {
		margin: 16px 0;
	}
}
</style>
