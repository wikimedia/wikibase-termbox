interface EntityEditabilityResolver {

	isEditable( id: string ): Promise<boolean>;

}

export default EntityEditabilityResolver;
