<template>
	<div class="wb-ui-anon-edit-warning" tabindex="-1" v-focus>
		<h4 class="wb-ui-anon-edit-warning__heading">
			{{ message( MESSAGE_KEYS.EDIT_WARNING_HEADING ) }}
		</h4>
		<IconMessageBox type="warning">
			{{ message( MESSAGE_KEYS.EDIT_WARNING_MESSAGE ) }}
		</IconMessageBox>
		<p class="wb-ui-anon-edit-warning__persist">
			<Checkbox
				:value="warnRecurringly"
				@input="warnRecurringly = $event"
				:label="message( MESSAGE_KEYS.EDIT_WARNING_DISMISS_PERSIST )"
			/>
		</p>
		<div class="wb-ui-anon-edit-warning__button-group">
			<EventEmittingButton
				type="primaryProgressive"
				:message="message( MESSAGE_KEYS.LOGIN )"
				:href="loginLinkUrl"
				:prevent-default="false"
				@click="persistUserPreference()"
			/>
			<EventEmittingButton
				type="normal"
				:message="message( MESSAGE_KEYS.EDIT_WARNING_DISMISS_BUTTON )"
				@click="persistUserPreference(); $emit( 'dismiss' )"
			/>
		</div>
		<div class="wb-ui-anon-edit-warning__button-group">
			<EventEmittingButton
				type="framelessProgressive"
				:message="message( MESSAGE_KEYS.CREATE_ACCOUNT )"
				:href="signUpLinkUrl"
				:prevent-default="false"
				@click="persistUserPreference()"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import Messages from '@/components/mixins/Messages';
import EventEmittingButton from '@/components/EventEmittingButton.vue';
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import {
	NS_LINKS,
	NS_USER,
} from '@/store/namespaces';
import Checkbox from '@/components/Checkbox.vue';
import { USER_PREFERENCE_SET } from '@/store/user/actionTypes';
import { UserPreference } from '@/common/UserPreference';
import { action } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import IconMessageBox from '@/components/IconMessageBox.vue';

export default defineComponent( {
	name: 'AnonEditWarning',
	components: { IconMessageBox, Checkbox, EventEmittingButton },
	mixins: [ Messages ],
	data() {
		return { warnRecurringly: true };
	},
	computed: {
		...mapState( NS_LINKS, [ 'loginLinkUrl', 'signUpLinkUrl' ] ),
	},
	emits: [ 'dismiss' ],
	methods: {
		persistUserPreference(): void {
			this.$store.dispatch(
				action( NS_USER, USER_PREFERENCE_SET ),
				{
					name: UserPreference.HIDE_ANON_EDIT_WARNING,
					value: !this.warnRecurringly,
				},
			);
		},
	},
} );
</script>

<style lang="scss">
.wb-ui-anon-edit-warning {
	margin: 0 8px;

	&__heading {
		text-align: center;
		font-weight: bold;
		margin-top: 10px;
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
