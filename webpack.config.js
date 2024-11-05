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
            {},
        ),
    );

let lastChangedFiles = new Map();
const loadLastChangedFiles = async () => {
    if (await pathExists(CHANGES_FILENAME)) {
        lastChangedFiles = new Map(
            Object.entries(
                JSON.parse((await readFile(CHANGES_FILENAME)).toString()),
            ),
        );
    }
};

let newChangedFiles = new Map();
const writeNewChangedFiles = async () => {
    await writeFile(
        CHANGES_FILENAME,
        JSON.stringify(Object.fromEntries(newChangedFiles)),
    );
};

const buildPopup = async () => {
    console.log("Building popup");
    await loadLastChangedFiles();
    let shouldRunBool = false;
    for await (const file of klaw("./popup", {
        filter: (filePath) => {
            const dirs = filePath.split(path.sep);
            const shouldExclude = dirs.includes("out") ||
                                dirs.includes("node_modules") ||
                                dirs.includes(".next") ||
                                dirs.includes(".parcel-cache");
            return !shouldExclude
        },
    })) {
        if (
            !lastChangedFiles.has(file.path) ||
            lastChangedFiles.get(file.path) < file.stats.mtimeMs
        ) {
            shouldRunBool = true;
        }
        newChangedFiles.set(file.path, file.stats.mtimeMs);
    }

    // Always returning here, no changes ever detected
    if (!shouldRunBool) return console.log("No changes detected on popup.");

    const ret = spawnSync("cd ./popup && yarn && yarn build", { shell: true });

    if (ret.error) throw ret.error;

    console.log(`Popup Build: ${ret.stdout.toString()}`);

    if (ret.status != 0) {
        throw new Error(`Popup build returned with code: ${ret.status}`);
    }

    await writeNewChangedFiles();
    console.log("Wrote new changed files.");
};

const copyDist = async () => {
    console.log("Copying dist files...");
    await Promise.all([
        copy("./dist/base/.", "./dist/chrome"),
        copy("./dist/base/.", "./dist/firefox"),
    ]);
    console.log("Copied dist files.");
};

/**
 * @type {webpack.Configuration}
 */
const config = {
    name: "base",
    mode: "production",
    devtool: "inline-source-map",
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"],
        // Add support for TypeScripts fully qualified ESM imports.
        extensionAlias: {
            ".js": [".js", ".ts"],
        },
    },
    entry: {
        "base/content-scripts": "./content-scripts/index.js",
        "base/background": "./background.js",
    },
    output: { path: path.resolve("dist"), filename: "[name].js" },
    watchOptions: {
        ignored: ["**/node_modules", "**/dist"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "ts-loader",
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.[j]sx?/,
                exclude: /node_modules/,
                loader: "esbuild-loader",
                resolve: {
                    fullySpecified: false,
                },
            },
        ],
    },
    plugins: [
        new WebpackShellPluginNext({
            // To work on watch
            onDoneWatch: {
                scripts: [buildPopup, copyDist],
                parallel: false,
            },

            // To Build Extension:
            // just on build
            onBeforeNormalRun: {
                scripts: [buildPopup],
                blocking: true,
                parallel: false,
            },
            // build and watch init
            onBuildEnd: {
                scripts: [copyDist],
                parallel: true,
            },
        }),
        new CopyPlugin({
            patterns: [
                {
                    context: "./popup/out",
                    from: ".",
                    to: "base/",
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
