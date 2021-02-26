import LoggableError from '@/common/error/LoggableError';
import { Request } from 'express';

export function buildErrorContextWithRequestInfo(
	error: LoggableError,
	request: Request,
): Record<string, unknown> & { url: string; reqId?: string } {
	return {
		...error.getContext(),
		url: request.url,
		reqId: request.header( 'X-Request-Id' ),
	};
}
