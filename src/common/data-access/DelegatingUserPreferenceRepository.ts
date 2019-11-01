import SingleUserPreferenceRepository from '@/common/data-access/SingleUserPreferenceRepository';

export default class DelegatingUserPreferenceRepository<T> implements SingleUserPreferenceRepository<T> {
	private readonly repoOne: SingleUserPreferenceRepository<T>;
	private readonly repoTwo: SingleUserPreferenceRepository<T>;
	private readonly useRepoOne: boolean;

	public constructor(
		repoOne: SingleUserPreferenceRepository<T>,
		repoTwo: SingleUserPreferenceRepository<T>,
		useRepoOne: boolean,
	) {
		this.repoOne = repoOne;
		this.repoTwo = repoTwo;
		this.useRepoOne = useRepoOne;
	}

	public setPreference( value: T ): Promise<void> {
		return this.chooseRepository().setPreference( value );
	}

	public getPreference(): Promise<T> {
		return this.chooseRepository().getPreference();
	}

	private chooseRepository(): SingleUserPreferenceRepository<T> {
		return this.useRepoOne ? this.repoOne : this.repoTwo;
	}

}
