import { ComponentOptions } from 'vue';

export interface ConfigOptions {
	textFieldCharacterLimit: number;
	licenseAgreementInnerHtml: string;
	copyrightVersion: string;
}

export default function newConfigMixin( config: ConfigOptions ): ComponentOptions {
	return {
		computed: {
			config: () => config,
		},
	};
}
