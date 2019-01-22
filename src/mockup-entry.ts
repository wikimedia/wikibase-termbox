import MWConfig from '@/mock-data/MwConfig';
import entity from './mock-data/data/Q64_data.json';
import * as directionalities from '@/mock-data/data/en_lang_dir_data.json';
import ImmediatelyInvokingEntityLoadedHookHandler from '@/mock-data/ImmediatelyInvokingEntityLoadedHookHandler';
import MwWindow from '@/client/mediawiki/MwWindow';
import getOrEnforceUrlParameter from './mock-data/getOrEnforceUrlParameter';
import MockupWikibaseContentLanguages from '@/mock-data/MockWikibaseContentLanguages';
import { message } from './mock-data/MockMwMessages';

const language = getOrEnforceUrlParameter( 'language', 'de' );
const preferredLanguages = getOrEnforceUrlParameter(
	'preferredLanguages',
	'en|de|fr|bar|nds|nl|it|es|ru|vmf|tr|gsw|da|hr|ku-latn|el|ksh|pl|hsb|frr|dsb|stq|pfl',
);

( window as MwWindow ).mw = {
	config: new MWConfig( language ),
	hook: () => new ImmediatelyInvokingEntityLoadedHookHandler( entity ),
	Title: class Title { public getUrl() { return '/edit/' + entity.id; } },
	message,
	uls: {
		getFrequentLanguageList: () => preferredLanguages.split( '|' ),
	},
};

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
