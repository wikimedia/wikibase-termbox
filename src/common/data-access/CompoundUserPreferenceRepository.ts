import SingleUserPreferenceRepository, {
	ReadingSingleUserPreferenceRepository,
	WritingSingleUserPreferenceRepository,
} from '@/common/data-access/SingleUserPreferenceRepository';

export default class CompoundUserPreferenceRepository<T> implements SingleUserPreferenceRepository<T> {
	private readingRepository: ReadingSingleUserPreferenceRepository<T>;
	private writingRepository: WritingSingleUserPreferenceRepository<T>;

	public constructor(
		readingRepository: ReadingSingleUserPreferenceRepository<T>,
		writingRepository: WritingSingleUserPreferenceRepository<T>,
	) {
		this.writingRepository = writingRepository;
		this.readingRepository = readingRepository;
	}

	public getPreference(): Promise<T> {
		return this.readingRepository.getPreference();
	}

	public setPreference( value: T ): Promise<void> {
		return this.writingRepository.setPreference( value );
	}

}
