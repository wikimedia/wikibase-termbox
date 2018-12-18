import MWConfig from '@/mock-data/MwConfig';
import { StringTMap } from '@/datamodel/LanguageTranslations';
import entity from './mock-data/data/Q64_data.json';
import * as languageMap from '@/mock-data/data/en_lang_data.json';
import * as directionalities from '@/mock-data/data/en_lang_dir_data.json';
import ImmediatelyInvokingEntityLoadedHookHandler from '@/mock-data/ImmediatelyInvokingEntityLoadedHookHandler';
import MwWindow from '@/client/mediawiki/MwWindow';

( window as MwWindow ).mw = {
	config: new MWConfig(),
	hook: () => new ImmediatelyInvokingEntityLoadedHookHandler( entity ),
};

class MockupWikibaseContentLanguages {
	public getAllPairs(): StringTMap<string> {
		return languageMap.default;
	}
}

( window as MwWindow ).wb = {
	WikibaseContentLanguages: MockupWikibaseContentLanguages,
};

( window as MwWindow ).$ = {
	uls: {
		data: {
			getDir: ( code: string ) => directionalities.default[ code ],
		},
	},
};
