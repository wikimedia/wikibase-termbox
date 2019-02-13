declare module 'axios/lib/adapters/http' { // https://stackoverflow.com/q/50954167
	import { AxiosAdapter } from 'axios';
	const httpAdapter: AxiosAdapter;
	export default httpAdapter;
}
