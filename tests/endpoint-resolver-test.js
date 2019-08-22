'use strict';

const assert = require('assert');
const path = require('path');

const { EndpointResolver, EndpointResolverError } = require('../lib');

const packageExport = require('..');

const validSchema = path.join(__dirname, 'resources/test-schema.json');

describe('EndpointResolver', () => {

	describe('Package export', () => {
		it('Should export the EndpointResolver class', () => {
			assert.strictEqual(packageExport, EndpointResolver);
		});
	});

	describe('resolve', () => {

		it('Should fail if the schema path does not exist', async () => {

			const endpointResolver = new EndpointResolver('./unknown-schema.json');

			await assert.rejects(() => endpointResolver.resolve('foo', 'list'), {
				name: 'EndpointResolverError',
				code: EndpointResolverError.codes.SCHEMA_NOT_FOUND
			});
		});

		it('Should fail if the schema is a number', async () => {

			const invalidSchema = 10;

			const endpointResolver = new EndpointResolver(invalidSchema);

			await assert.rejects(() => endpointResolver.resolve('foo', 'list'), {
				name: 'EndpointResolverError',
				code: EndpointResolverError.codes.INVALID_SCHEMA
			});
		});

		it('Should fail if the schema is an array', async () => {

			const invalidSchema = [];

			const endpointResolver = new EndpointResolver(invalidSchema);

			await assert.rejects(() => endpointResolver.resolve('foo', 'list'), {
				name: 'EndpointResolverError',
				code: EndpointResolverError.codes.INVALID_SCHEMA
			});
		});

		it('Should fail if schema has no servers', async () => {

			const endpointResolver = new EndpointResolver({});

			await assert.rejects(() => endpointResolver.resolve('foo', 'list'), {
				name: 'EndpointResolverError',
				code: EndpointResolverError.codes.SERVER_NOT_FOUND
			});
		});

		it('Should fail if no server can be found', async () => {

			const endpointResolver = new EndpointResolver(validSchema, 'qa');

			await assert.rejects(() => endpointResolver.resolve('foo', 'list'), {
				name: 'EndpointResolverError',
				code: EndpointResolverError.codes.SERVER_NOT_FOUND
			});
		});

		it('Should fail if schema has no paths', async () => {

			const schema = {
				servers: [
					{
						url: 'https://local-example.com/api',
						variables: {
							environment: {
								default: 'local'
							}
						}
					}
				]
			};

			const endpointResolver = new EndpointResolver(schema);

			await assert.rejects(() => endpointResolver.resolve('foo', 'list'), {
				name: 'EndpointResolverError',
				code: EndpointResolverError.codes.ENDPOINT_NOT_FOUND
			});
		});

		it('Should fail if no endpoint can be found', async () => {

			const endpointResolver = new EndpointResolver(validSchema, 'prod');

			await assert.rejects(() => endpointResolver.resolve('foo', 'unknown'), {
				name: 'EndpointResolverError',
				code: EndpointResolverError.codes.ENDPOINT_NOT_FOUND
			});
		});

		it('Should return the httpMethod and url if endpoint is found', async () => {

			const endpointResolver = new EndpointResolver(validSchema, 'prod');

			const endpoint = await endpointResolver.resolve('foo', 'list');

			assert.deepStrictEqual(endpoint, {
				httpMethod: 'get',
				url: 'https://example.com/api/foo'
			});
		});

		it('Should search for local if dev server is not found', async () => {

			const endpointResolver = new EndpointResolver(validSchema, 'dev');

			const endpoint = await endpointResolver.resolve('foo', 'list');

			assert.deepStrictEqual(endpoint, {
				httpMethod: 'get',
				url: 'https://local-example.com/api/foo'
			});
		});

		it('Should use local as default environment', async () => {

			const endpointResolver = new EndpointResolver(validSchema);

			const endpoint = await endpointResolver.resolve('foo', 'list');

			assert.deepStrictEqual(endpoint, {
				httpMethod: 'get',
				url: 'https://local-example.com/api/foo'
			});
		});

		it('Should search for namespace outside the http method of the schema', async () => {

			const endpointResolver = new EndpointResolver(validSchema, 'prod');

			const endpoint = await endpointResolver.resolve('bar', 'list');

			assert.deepStrictEqual(endpoint, {
				httpMethod: 'get',
				url: 'https://example.com/api/bar'
			});
		});

		it('Should search for namespace and method outside the http method of the schema', async () => {

			const endpointResolver = new EndpointResolver(validSchema, 'prod');

			const endpoint = await endpointResolver.resolve('bar', 'get');

			assert.deepStrictEqual(endpoint, {
				httpMethod: 'get',
				url: 'https://example.com/api/bar/{id}'
			});
		});
	});
});
