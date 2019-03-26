export default function formDataRequestTransformation( data: any ) {
	if ( !data || typeof data !== 'object' || Array.isArray( data ) ) {
		return data;
	}

	const formData = new FormData();
	Object.entries( data )
		.forEach( ( [ key, value ] ) => formData.append( key, value as string ) );

	return formData;
}
