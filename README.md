# Endpoint resolver

A package to resolve a JANIS endpoint

[![Build Status](https://travis-ci.org/janis-commerce/endpoint-resolver.svg?branch=master)](https://travis-ci.org/janis-commerce/endpoint-resolver)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/endpoint-resolver/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/endpoint-resolver?branch=master)

## Installation
```sh
npm install @janiscommerce/endpoint-resolver
```

## API


## Usage
```js
const EndpointResolver = require('@janiscommerce/endpoint-resolver');

EndpointResolver.setSchema('path/to/schema');

const { httpMethod, url, error } = EndpointResolver.resolve('some-namespace', 'some-method');
```

## Examples