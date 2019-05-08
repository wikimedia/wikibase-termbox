import PackageInfo from '../metadata/PackageInfo';

export default function ( info: PackageInfo ) {
	const appInformation = `${ info.name }/${ info.version }`;
	const authorInfo = `${ info.author! }`;
	const libaryInfo = `axios/${ info.dependencies!.axios! }`;

	return `${ appInformation } (${ authorInfo }) ${ libaryInfo }`;
}
