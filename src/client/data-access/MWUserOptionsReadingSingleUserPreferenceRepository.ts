import { ReadingSingleUserPreferenceRepository } from '@/common/data-access/SingleUserPreferenceRepository';
import { MWUserOptions } from '@/client/mediawiki/MwWindow';

export default class MWUserOptionsReadingSingleUserPreferenceRepository implements
	ReadingSingleUserPreferenceRepository<unknown> {
	private optionName: string;
	private mwUserOptions: MWUserOptions;

	public constructor( optionName: string, mwUserOptions: MWUserOptions ) {
		this.optionName = optionName;
		this.mwUserOptions = mwUserOptions;
	}

	public getPreference(): Promise<unknown> {
		return Promise.resolve( this.mwUserOptions.get( this.optionName ) );
	}

}
