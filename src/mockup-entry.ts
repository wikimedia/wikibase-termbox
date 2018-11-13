import MWConfig from '@/mock-data/MwConfig';
import entity from './mock-data/data/Q64_data.json';
import ImmediatelyInvokingEntityLoadedHookHandler from '@/mock-data/ImmediatelyInvokingEntityLoadedHookHandler';
/// <reference path="src/types/client/mediawiki/index.d.ts"/>
import * as mediawiki from 'mediawiki';

declare const window: mediawiki.mwWindow;

window.mw = {
	config: new MWConfig(),
	hook: ( key: 'wikibase.entityPage.entityLoaded' ) => new ImmediatelyInvokingEntityLoadedHookHandler( entity ),
};
