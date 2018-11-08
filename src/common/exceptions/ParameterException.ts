import TypeException from '@/common/exceptions/TypeException';

export default class ParameterException extends TypeException {
	constructor( message?: string ) {
		super( message );
	}
}
