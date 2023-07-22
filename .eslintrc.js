module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: ["eslint:recommended", "airbnb-base", "prettier"],
    parserOptions: {
        ecmaVersion: "latest",
    },
    rules: {
        "no-underscore-dangle": ["error", { allow: ["_id"] }],
        "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
        "import/no-extraneous-dependencies": ["error", {"devDependencies": true, "optionalDependencies": false, "peerDependencies": true, "packageDir": "."}],
        "import/no-unresolved": [2, { ignore: ["^dotenv$"] }],
    },
    settings: {
        'import/core-modules': ['dotenv']
    }
};
