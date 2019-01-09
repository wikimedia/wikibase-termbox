export default interface EntityEditabilityResolver {

	isEditable( id: string ): Promise<boolean>;

}
