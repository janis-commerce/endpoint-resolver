'use strict';

class EndpointResolverError extends Error {

	static get codes() {

		return {
			INVALID_SCHEMA: 1,
			ENDPOINT_NOT_FOUND: 2
		};

	}

	constructor(err, code) {
		super(err);
		this.message = err.message || err;
		this.code = code;
		this.name = 'EndpointResolverError';
	}
}

module.exports = EndpointResolverError;
