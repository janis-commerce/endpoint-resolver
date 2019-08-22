'use strict';

const util = require('util');
const fs = require('fs');

const EndpointResolverError = require('./endpoint-resolver-error');
const SchemaSearch = require('./schema-search');

class EndpointResolver {

	constructor(schema, env) {
		this.schema = schema;
		this.env = env;
	}

	get environment() {
		return this.env || 'local';
	}

	async resolve(ns, method) {

		if(typeof this.schema === 'string')
			await this._loadSchema();

		this.validateSchema();

		const schemaSearch = new SchemaSearch(this.schema);
		const { apiBaseUrl, error: serverSearchError } = schemaSearch.searchBaseUrl(this.environment);

		if(serverSearchError)
			throw new EndpointResolverError(serverSearchError, EndpointResolverError.codes.SERVER_NOT_FOUND);

		const { path, httpMethod, error: endpointSearchError } = schemaSearch.searchPath(ns, method);

		if(endpointSearchError)
			throw new EndpointResolverError(endpointSearchError, EndpointResolverError.codes.ENDPOINT_NOT_FOUND);

		return {
			httpMethod,
			url: `${apiBaseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
		};
	}

	async _loadSchema() {
		const readFile = util.promisify(fs.readFile);

		try {
			const fileContent = await readFile(this.schema, 'utf8');
			this.schema = JSON.parse(fileContent);
		} catch(e) {
			throw new EndpointResolverError(e, EndpointResolverError.codes.SCHEMA_NOT_FOUND);
		}
	}

	validateSchema() {
		if(typeof this.schema !== 'object' || Array.isArray(this.schema))
			throw new EndpointResolverError(`Invalid schema: ${util.inspect(this.schema)}`, EndpointResolverError.codes.INVALID_SCHEMA);
	}

}

module.exports = EndpointResolver;
