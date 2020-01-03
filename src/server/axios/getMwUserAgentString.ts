import PackageInfo from '../metadata/PackageInfo';

export default function ( info: Required<PackageInfo> ): string {
	const appInformation = `${info.name}/${info.version}`;
	const authorInfo = `${info.author}`;
	const libraryInfo = `axios/${info.dependencies.axios}`;

	return `${appInformation} (${authorInfo}) ${libraryInfo}`;
}
