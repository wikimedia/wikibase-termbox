interface SingleUserPreferenceRepository<T> {

	getPreference(): Promise<T>;

	setPreference( value: T ): Promise<void>;

}

export default SingleUserPreferenceRepository;
