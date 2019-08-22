'use strict';

class EndpointResolverError extends Error {

	static get codes() {

		return {
			SCHEMA_NOT_FOUND: 1,
			INVALID_SCHEMA: 2,
			SERVER_NOT_FOUND: 3,
			ENDPOINT_NOT_FOUND: 4
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
