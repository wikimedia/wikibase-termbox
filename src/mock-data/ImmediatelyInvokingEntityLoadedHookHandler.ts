export default class ImmediatelyInvokingEntityLoadedHookHandler {
	private entity: unknown;

	public constructor( entity: unknown ) {
		this.entity = entity;
	}

	public add( hookCallback: ( entity: unknown ) => void ): void {
		hookCallback( this.entity );
	}

}
