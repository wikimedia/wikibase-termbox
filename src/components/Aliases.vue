<template>
	<ul
		v-if="aliases && aliases.length > 0"
		class="wb-ui-aliases"
		v-inlanguage="language"
	>
		<li
			v-for="alias in aliases"
			:key="alias.value"
			class="wb-ui-aliases__alias"
			:data-separator="message( MESSAGE_KEYS.ALIAS_SEPARATOR )"
		>
			{{ alias.value }}
		</li>
	</ul>
	<div class="wb-ui-aliases wb-ui-aliases--placeholder" v-else />
</template>

<script lang="ts">
import {
	defineComponent,
	PropType,
} from 'vue';
import { Term } from '@wmde/wikibase-datamodel-types';
import Messages from '@/components/mixins/Messages';

export default defineComponent( {
	name: 'Aliases',
	mixins: [ Messages ],
	props: {
		aliases: { required: false, default: null, type: Array as PropType<Term[]> },
	},
	computed: {
		language(): string {
			return this.aliases[ 0 ].language;
		},
	},
} );
</script>

<style lang="scss">
.wb-ui-aliases {
	@include aliasesFont();
	@include hyphens();

	&__alias {
		display: inline;

		&:not( :last-child ):after {
			content: attr( data-separator );
			white-space: nowrap;
			padding: 0 0.4em;
		}
	}

	&--placeholder {
		height: 1.25em;
	}
}
</style>
