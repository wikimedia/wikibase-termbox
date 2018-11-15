import MWConfig from '@/mock-data/MwConfig';
import entity from './mock-data/data/Q64_data.json';
import ImmediatelyInvokingEntityLoadedHookHandler from '@/mock-data/ImmediatelyInvokingEntityLoadedHookHandler';
import MwWindow from './client/MwWindow';

( window as MwWindow ).mw = {
	config: new MWConfig(),
	hook: () => new ImmediatelyInvokingEntityLoadedHookHandler( entity ),
};
