<template>
	<ul v-if="aliases && aliases.length > 0"
		class="wb-ui-aliases"
		v-inlanguage="language">
		<li v-for="alias in aliases"
			class="wb-ui-aliases__alias"
			:data-separator="message( MESSAGE_KEYS.ALIAS_SEPARATOR )">{{ alias.value }}</li>
	</ul>
	<div class="wb-ui-aliases wb-ui-aliases--placeholder" v-else/>
</template>

<script lang="ts">
import { VueConstructor } from 'vue';
import Component, { mixins } from 'vue-class-component';
import { NS_LANGUAGE } from '@/store/namespaces';
import Language from '@/datamodel/Language';
import Term from '@/datamodel/Term';
import Messages from '@/components/mixins/Messages';
import { namespace } from 'vuex-class';
import { Prop } from 'vue-property-decorator';

@Component
export default class Aliases extends ( mixins( Messages ) as VueConstructor ) {

	@Prop( { required: true } )
	public aliases!: Term[];

	@namespace( NS_LANGUAGE ).Getter( 'getByCode' )
	public getLanguageByCode!: ( languageCode: string ) => Language;

	get language() {
		return this.getLanguageByCode( this.aliases[ 0 ].language );
	}

}
</script>

<style lang="scss">
.wb-ui-aliases {
	color: $color-light-azureish-gray;
	line-height: 1.3em;
	font-family: $font-family-sansserif;

	&__alias {
		display: inline-block; // see https://phabricator.wikimedia.org/T217244 why not inline

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
