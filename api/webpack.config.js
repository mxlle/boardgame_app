const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'production',
    target: 'node',
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        plugins: [new TsconfigPathsPlugin()]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: "env/", to: "env/"},
                {from: "src/data/", to: "src/data/"},
            ]
        })
    ],
    // Optional dependencies to be ignored
    externals: [
        'aws4',
        'mongodb-client-encryption'
    ],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};