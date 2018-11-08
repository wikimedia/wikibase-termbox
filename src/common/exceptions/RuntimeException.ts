import LogicException from '@/common/exceptions/LogicException';

export default class RuntimeException extends LogicException {
	constructor( message?: string ) {
		super( message );
	}
}
