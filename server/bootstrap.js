require('ignore-styles');
require('url-loader');
require('file-loader');
require('babel-register')({
    "presets": [
        "babel-preset-env"
    ],
    "plugins": [
        "transform-react-jsx",
        "transform-es2015-modules-commonjs",
        "syntax-dynamic-import",
        "dynamic-import-node",
        "syntax-object-rest-spread"
        // "react-loadable/babel"
    ]
});
require('./index');
