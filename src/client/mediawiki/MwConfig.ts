type MwConfigValues = {
	wbRepo: {
		scriptPath: string;
	};
	wgNamespaceIds: {
		special: number;
	};
	wbMultiLingualStringLimit: number;
	wbCopyright: {
		version: string;
		messageHtml: string;
	};
	wbEntityId: string;
	wgRevisionId: number;
	wgPageName: string;
	wbIsEditView: boolean;
	wgRelevantPageIsProbablyEditable: boolean;
	wgUserName: string | null;
	wgUserLanguage: string;
};

interface MwConfig {
	get<K extends keyof MwConfigValues>( key: K ): MwConfigValues[ K ];
}

export default MwConfig;
