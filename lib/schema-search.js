'use strict';

class SchemaSearch {

	constructor(schema) {
		this.schema = schema;
	}

	static get httpMethods() {
		return ['get', 'post', 'patch', 'put', 'delete'];
	}

	searchBaseUrl(environment) {

		const { schema } = this;

		if(!schema.servers) {
			return {
				error: 'Schema has no servers'
			};
		}

		for(const server of schema.servers) {
			if(server.variables && server.variables.environment && server.variables.environment.default === environment) {

				const serverUrl = server.url;
				const serverInternalUrl = server['x-internal-url'] || server.url;

				const basePath = server.variables.basePath && server.variables.basePath.default ? server.variables.basePath.default : '';

				return {
					apiBaseUrl: serverUrl + basePath,
					apiInternalBaseUrl: serverInternalUrl + basePath
				};

			}
		}

		// Double check for local env migration
		if(environment === 'dev')
			return this.searchBaseUrl('local');

		return {
			error: `Server not found for environment ${environment}`
		};
	}

	searchPath(namespace, method) {

		const { schema } = this;

		if(!schema.paths) {
			return {
				error: 'Schema has no paths'
			};
		}

		for(const [path, pathData] of Object.entries(schema.paths)) {

			if(pathData['x-janis-namespace'] && pathData['x-janis-namespace'] !== namespace)
				continue;

			if(pathData['x-janis-method'] && pathData['x-janis-method'] !== method)
				continue;

			for(const theHttpMethod of this.constructor.httpMethods) {

				if(!pathData[theHttpMethod])
					continue;

				if((pathData['x-janis-namespace'] || pathData[theHttpMethod]['x-janis-namespace']) === namespace
					&& (pathData['x-janis-method'] || pathData[theHttpMethod]['x-janis-method']) === method) {

					// Si coinciden ambos parametros, devuelve el path
					return {
						path,
						httpMethod: theHttpMethod
					};
				}

			}

		}

		return {
			error: `Endpoint not found for namespace ${namespace} and method ${method}`
		};
	}

}

module.exports = SchemaSearch;
