# @airtable/blocks-webpack-bundler

This is a webpack bundler that can be used with @airtable/blocks-cli@beta. This bundler allows you
to customize the webpack config that is used when developing and bundling your Airtable app.

## Installation

Install this package as a dependency of your Airtable app. Inside your app project folder, run

```
npm install @airtable/blocks-webpack-bundler --save-dev
```

## Customization

-   Create a file named `bundler.js` inside your app project folder with the following contents:

```js
const createBundler = require('@airtable/blocks-webpack-bundler').default;

function createConfig(baseConfig) {
    // Add any desired customizations here
    return baseConfig;
}

exports.default = () => {
    return createBundler(createConfig);
};
```

-   Inside your `block.json` file, add a "bundler" field, with a "module" field inside that points
    to your bundler file.

```diff
{
    "version": "1.0",
-   "frontendEntry": "./frontend/index.js"
+   "frontendEntry": "./frontend/index.js",
+   "bundler": {
+       "module": "./bundler.js"
+   }
}
```

## Example

Here are some examples of how you can customize the webpack config via the `bundler.js` file.

Support Sass/SCSS files:

```js
const createBundler = require('@airtable/blocks-webpack-bundler').default;

function createConfig(baseConfig) {
    baseConfig.module.rules.push({
        test: /\.s[ac]ss$/i,
        use: [
            // Make sure you have installed these loaders in your package.json as well!
            // See https://webpack.js.org/loaders/sass-loader/ for more info
            'style-loader',
            'css-loader',
            'sass-loader',
        ],
    });
    return baseConfig;
}

exports.default = () => {
    return createBundler(createConfig);
};
```

Support using [flow](https://flow.org/) to write your app:

```js
const createBundler = require('@airtable/blocks-webpack-bundler').default;

function createConfig(baseConfig) {
    baseConfig.module.rules.push({
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
        options: {
            babelrc: false,
            configFile: false,
            presets: [
                require.resolve('@babel/preset-env'),
                require.resolve('@babel/preset-react'),
                // Make sure you have installed this in your package.json by running
                // `npm install @babel/preset-flow --save-dev`
                require.resolve('@babel/preset-flow'),
            ],
        },
    });
    return baseConfig;
}

exports.default = () => {
    return createBundler(createConfig);
};
```
