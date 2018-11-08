import MWConfig from '@/mock-data/MwConfig';
import entity from './mock-data/data/Q64_data.json';
import ImmediatelyInvokingEntityLoadedHookHandler from '@/mock-data/ImmediatelyInvokingEntityLoadedHookHandler';

declare global {
	interface Window { mw: any; }
}

window.mw = {
	config: new MWConfig(),
	hook: () => new ImmediatelyInvokingEntityLoadedHookHandler( entity ),
};
