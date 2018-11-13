// @flow
const {h, u} = require('client_server_shared/hu');
const wrappedRequest = require('request');

wrappedRequest.getAsync = u.promiseFromCallback(wrappedRequest.get.bind(wrappedRequest));
wrappedRequest.postAsync = u.promiseFromCallback(wrappedRequest.post.bind(wrappedRequest));
wrappedRequest.patchAsync = u.promiseFromCallback(wrappedRequest.patch.bind(wrappedRequest));
wrappedRequest.deleteAsync = u.promiseFromCallback(wrappedRequest.delete.bind(wrappedRequest));

module.exports = wrappedRequest;
