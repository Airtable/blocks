/**
 * Initialize the LiveReload client (as provided by the `webpack-dev-server`
 * module) and monitor the resulting messages for an indication of the
 * `webpack-dev-server` falling offline. Producing an uncaught error in this
 * case causes the "run frame" interface to update with an indication of the
 * problem.
 */
require('webpack-dev-server/client');

/**
 * The messages emitted by `webpack-dev-server` are not formally documented,
 * but the module's internals endorse their use from third-party code:
 *
 *     // Send messages to the outside, so plugins can consume it.
 *     function sendMsg(type, data) {
 *
 * https://github.com/webpack/webpack-dev-server/blob/cd39491ea395c985f2014dfc03379db5c894f711/client-src/default/utils/sendMessage.js#L5
 */
addEventListener('message', function(event) {
    if (event && event.data && event.data.type === 'webpackClose') {
        throw new Error('Disconnected from development server');
    }
});
