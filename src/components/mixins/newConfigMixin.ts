import Vue from 'vue';
import Component from 'vue-class-component';

export interface ConfigOptions {
	textFieldCharacterLimit: number;
}

export default function newConfigMixin( config: ConfigOptions = {
	textFieldCharacterLimit: 0,
} ) {
	@Component
	class Config extends Vue {
		public readonly config = config;
	}

	return Config;
}
