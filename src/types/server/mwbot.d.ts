declare module 'mwbot' {
	export default class mwbot {
		constructor( config: object );
		request( params: object ): Promise<object>;
	}
}
