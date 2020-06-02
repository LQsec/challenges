const path = require('path');

module.exports = {
    entry: "./src/entry.js",
    output: {
        path: path.join(__dirname, 'dist/js'),
        filename: "bundle.js"
    },
    module: {
        rules: [
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }
};