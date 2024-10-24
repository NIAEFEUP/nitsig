import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
    { files: ["**/*.{js,mjs,cjs,ts,tsx}"] },
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.webextensions },
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    // {
    //     ignores: [
    //         ".DS_Store",
    //         "/node_modules",
    //         "/dist",
    //         "/.yarn",
    //         "/.github",
    //         "/popup/.next",
    //         "/popup/.yarn",
    //         "/popup/node_modules",
    //         "/popup/out",
    //         ".changes.json",
    //         "package-lock.json",
    //     ],
    // },
];
