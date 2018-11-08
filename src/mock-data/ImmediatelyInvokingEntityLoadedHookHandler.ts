export default class ImmediatelyInvokingEntityLoadedHookHandler {
	private entity: any;

	public constructor( entity: any ) {
		this.entity = entity;
	}

	public add( hookCallback: ( entity: any ) => void ) {
		hookCallback( this.entity );
	}

}
