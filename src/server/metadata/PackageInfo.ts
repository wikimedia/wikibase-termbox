interface PackageInfo {
	name: string;
	version: string;
	author?: string;
	dependencies?: {
		[ index: string ]: string;
	};
}

export default PackageInfo;
