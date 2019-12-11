import { OpenAPIV3 } from 'openapi-types';

interface ServiceCheckerSample {
	title: string;
	request?: {
		params?: {
			[path: string]: string;
		};
		headers?: {
			[path: string]: string;
		};
		query?: {
			[key: string]: string | string[];
		};
		body?: {
			[path: string]: string;
		};
	};
	response?: {
		status: number;
		headers?: {
			[path: string]: string;
		};
		body?: {
			[path: string]: string;
		};
	};
}

interface OperationObject extends OpenAPIV3.OperationObject {
	'x-monitor'?: boolean;
	'x-amples'?: ServiceCheckerSample[];
}

interface PathItemObject extends OpenAPIV3.PathItemObject {
	get?: OperationObject;
	post?: OperationObject;
}

export interface Document extends OpenAPIV3.Document {
	paths: {
		[path: string]: PathItemObject;
	};
}
