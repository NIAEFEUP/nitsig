/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:import/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
        "eslint-config-prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
    },
    settings: {
        "react": {
            version: "detect",
        },
        "import/resolver": {
            typescript: {},
        },
    },
    env: {
        browser: true,
    },
    rules: {
        "react/display-name": "off",
    },
};
