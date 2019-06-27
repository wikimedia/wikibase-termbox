export interface WritingSingleUserPreferenceRepository<T> {
	setPreference( value: T ): Promise<void>;
}

export interface ReadingSingleUserPreferenceRepository<T> {
	getPreference(): Promise<T>;
}

interface SingleUserPreferenceRepository<T>
	extends WritingSingleUserPreferenceRepository<T>, ReadingSingleUserPreferenceRepository<T> {}

export default SingleUserPreferenceRepository;
