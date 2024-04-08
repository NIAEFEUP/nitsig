/// @ts-check

import CopyPlugin from "copy-webpack-plugin";
import WebpackShellPluginNext from "webpack-shell-plugin-next";
import path from "node:path";
import webpack from "webpack";
import fs from "fs-extra";
import klaw from "klaw";
import cp from "child_process";

const { pathExists, readFile, writeFile, copy } = fs;
const { spawnSync } = cp;

const CHANGES_FILENAME = ".changes.json";

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

let lastChangedFiles = new Map();
const loadLastChangedFiles = async () => {
    if (await pathExists(CHANGES_FILENAME)) {
        lastChangedFiles = new Map(
            Object.entries(
                JSON.parse((await readFile(CHANGES_FILENAME)).toString())
            )
        );
    }
};

let newChangedFiles = new Map();
const writeNewChangedFiles = async () => {
    await writeFile(
        CHANGES_FILENAME,
        JSON.stringify(Object.fromEntries(newChangedFiles))
    );
};

/**
 * @type {webpack.Configuration}
 */
const config = {
    name: "base",
    mode: "production",
    entry: {
        "base/content-scripts": "./content-scripts/src/index.js",
        "base/background": "./background.js",
    },
    output: { path: path.resolve("dist"), filename: "[name].js", clean: true },
    module: {
        rules: [
            {
                test: /\.[jt]sx?/,
                exclude: /node_modules/,
                loader: "esbuild-loader",
            },
        ],
    },
    plugins: [
        new WebpackShellPluginNext({
            onBuildStart: {
                scripts: [
                    async () => {
                        await loadLastChangedFiles();
                        let shouldRunBool = false;
                        for await (const file of klaw("./popup", {
                            filter: (path) => {
                                return !(
                                    path.includes("out") ||
                                    path.includes("node_modules") ||
                                    path.includes(".next") ||
                                    path.includes(".parcel-cache")
                                );
                            },
                        })) {
                            if (
                                !lastChangedFiles.has(file.path) ||
                                lastChangedFiles.get(file.path) <
                                    file.stats.mtimeMs
                            ) {
                                shouldRunBool = true;
                            }
                            newChangedFiles.set(file.path, file.stats.mtimeMs);
                        }

                        if (!shouldRunBool) return;

                        const ret = spawnSync(
                            "cd ./popup && yarn && yarn build",
                            { shell: true }
                        );

                        if (ret.error) throw ret.error;

                        console.log(`Popup Build: ${ret.stdout.toString()}`);

                        if (ret.status != 0) {
                            throw new Error(
                                `Popup build returned with code: ${ret.status}`
                            );
                        }

                        await writeNewChangedFiles();
                    },
                ],
                blocking: true,
                parallel: false,
            },
            onBuildEnd: {
                scripts: [
                    () => Promise.all([
                        copy("./dist/base/.", "./dist/chrome" ),
                        copy("./dist/base/.", "./dist/firefox"),
                    ])
                ]
            }
        }),
        new CopyPlugin({
            patterns: [
                {
                    context: "./popup/out",
                    from: ".",
                    to: "base/popup",
                },
                {
                    from: "./(css|html|images|js)/**/*",
                    to: "base/",
                },
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
