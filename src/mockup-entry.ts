import MWConfig from '@/mock-data/MwConfig';

declare global {
	interface Window { mw: any; }
}

window.mw = {
	config: new MWConfig(),
};
