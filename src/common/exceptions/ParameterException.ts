import TypeException from '@/common/exceptions/TypeException';

export default class ParameterException extends TypeException {
	public constructor( message?: string ) {
		super( message );
	}
}
