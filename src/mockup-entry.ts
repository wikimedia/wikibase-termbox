import MWConfig from '@/mock-data/MwConfig';
import entity from './mock-data/data/Q64_data.json';
import * as directionalities from '@/mock-data/data/en_lang_dir_data.json';
import ImmediatelyInvokingEntityLoadedHookHandler from '@/mock-data/ImmediatelyInvokingEntityLoadedHookHandler';
import MwWindow from '@/client/mediawiki/MwWindow';
import getOrEnforceUrlParameter from './mock-data/getOrEnforceUrlParameter';
import MockupWikibaseContentLanguages from '@/mock-data/MockWikibaseContentLanguages';
import MockMwMessages from '@/mock-data/MockMwMessages';

const language = getOrEnforceUrlParameter( 'language', 'de' );
/* tslint:disable:max-classes-per-file */

( window as MwWindow ).mw = {
	config: new MWConfig( language ),
	hook: () => new ImmediatelyInvokingEntityLoadedHookHandler( entity ),
	Title: class Title { public getUrl() { return '/edit/' + entity.id; } },
	message: MockMwMessages.message,
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
