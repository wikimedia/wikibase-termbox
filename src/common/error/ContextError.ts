import LoggableError from '@/common/error/LoggableError';

export default class ContextError extends Error implements LoggableError {
	private context: object;

	public constructor( message: string, context: object = {} ) {
		super( message );
		this.context = context;
	}

	public getContext(): object {
		return {
			message: this.message,
			...this.context,
		};
	}

}
