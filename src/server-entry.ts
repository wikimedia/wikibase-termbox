import TermboxRequest from '@/common/TermboxRequest';
import buildApp from '@/common/buildApp';
import EntityInitializer from '@/common/EntityInitializer';

export default ( context: any ) => {

	// TODO: this file becomes a lot shorter once server/app.ts is able to dispatch TermboxRequest objects itself

	return buildApp( new TermboxRequest(
		context.language,
		( new EntityInitializer() ).newFromSerialization( context.entity ) ),
	);
};
