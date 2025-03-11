const {defineConfig} = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'https://localhost:9000',
        specPattern: 'cypress/integration/**/*_spec.js',
    },
});
