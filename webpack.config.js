/// @ts-check

import CopyPlugin from "copy-webpack-plugin";
import WebpackShellPluginNext from "webpack-shell-plugin-next";
import path from "node:path";
import webpack from "webpack";
import fs from "fs-extra";
import klaw from "klaw";
import cp from "child_process";

const { pathExists, readFile, writeFile } = fs;
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
    mode: "production",
    entry: {
        "content-scripts": "./content-scripts/src/index.js",
        background: "./background.js",
    },
    output: { path: path.resolve("dist"), filename: "[name].js" },
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
                                );foo
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
                        )

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
        }),
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
                {
                    context: "./popup/out",
                    from: ".",
                    to: "popup",
                },
                {
                    from: "./css",
                    to: "css",
                },
                {
                    from: "./js",
                    to: "js",
                },
            ],
        }),
    ],
};

export default config;
