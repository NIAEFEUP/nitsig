/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:import/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:@typescript-eslint/recommended",
        "eslint-config-prettier",
    ],
    settings: {
        react: {
            version: "detect",
        },
        "import/resolver": {
            typescript: {},
        },
    },
    env: {
        browser: true,
    },
};
