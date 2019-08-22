# Endpoint resolver

A package to resolve a JANIS endpoint

[![Build Status](https://travis-ci.org/janis-commerce/endpoint-resolver.svg?branch=master)](https://travis-ci.org/janis-commerce/endpoint-resolver)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/endpoint-resolver/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/endpoint-resolver?branch=master)

## Installation
```sh
npm install @janiscommerce/endpoint-resolver
```

## API

### EndpointResolver

#### constructor(schema[, environment = 'local'])
**schema**: The schema object or file path (JSON only)
**environment**: The environment to fetch in the schema servers. Default is local.

#### async resolve(namespace, method)
**namespace**: The namespace to fetch (`x-janis-namespace` in the API schema)
**method**: The method to fetch (`x-janis-method` in the API schema)

Resolves an object with the `httpMethod` and `url` properties, or rejects with an error explaining the motive.

## Usage
```js
const EndpointResolver = require('@janiscommerce/endpoint-resolver');

const endpointResolver = new EndpointResolver('path/to/schema');

const { httpMethod, url, error } = endpointResolver.resolve('some-namespace', 'some-method');
```

## Examples
```js
const EndpointResolver = require('@janiscommerce/endpoint-resolver');

const endpointResolver = new EndpointResolver('schemas/public.json');
// Or
// const endpointResolver = new EndpointResolver(mySchemaObject);

try {
	const { httpMethod, url } = endpointResolver.resolve('user', 'list');

	console.log(httpMethod); // GET
	console.log(url); // https://example.com/user
} catch(e) {
	handleError(e);
}
```
