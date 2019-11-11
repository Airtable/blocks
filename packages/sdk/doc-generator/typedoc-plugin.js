const HideInternalPlugin = require('./lib/HideInternalPlugin').default;
const ExternalModuleNamePlugin = require('./lib/ExternalModuleNamePlugin').default;
const EnumFormattingPlugin = require('./lib/EnumFormattingPlugin').default;

module.exports = PluginHost => {
    const app = PluginHost.owner;
    app.converter.addComponent('hide-internal', new HideInternalPlugin(app.converter));
    app.converter.addComponent('external-module-name', new ExternalModuleNamePlugin(app.converter));
    app.converter.addComponent('enum-formatting', new EnumFormattingPlugin(app.converter));
};
