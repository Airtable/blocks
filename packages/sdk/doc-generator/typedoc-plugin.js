const HideInternalPlugin = require('./lib/HideInternalPlugin').default;
const ExternalModuleNamePlugin = require('./lib/ExternalModuleNamePlugin').default;

module.exports = PluginHost => {
    const app = PluginHost.owner;
    app.converter.addComponent('hide-internal', new HideInternalPlugin(app.converter));
    app.converter.addComponent('external-module-name', new ExternalModuleNamePlugin(app.converter));
};
