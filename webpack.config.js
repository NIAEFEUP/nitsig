/// @ts-check

import CopyPlugin from "copy-webpack-plugin";
import path from "node:path";
import webpack from "webpack";

/**
 * @type {CopyPlugin.TransformAllFunction}
 */
const transformManifests = (data) =>
    JSON.stringify(
        data.reduce(
            (acc, curr) => ({
                ...acc,
                ...JSON.parse(curr.data.toString()),
            }),
            {}
        )
    );

/**
 * @type {webpack.Configuration}
 */
const config = {
    mode: "production",
    entry: {
        "content-scripts": "./content-scripts/src/index.js",
    },
    output: { path: path.resolve("dist"), filename: "[name].js" },
    module: {
        rules: [
            {
                test: /\.[jt]sx?/,
                exclude: /node_modules/,
                loader: "esbuild-loader",
            },
            {
                test: /\.scss$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "./manifest/(base|chrome).json",
                    to: "chrome/manifest.json",
                    transformAll: transformManifests,
                },
                {
                    from: "./manifest/(base|firefox).json",
                    to: "firefox/manifest.json",
                    transformAll: transformManifests,
                },
            ],
        }),
    ],
};

export default config;
