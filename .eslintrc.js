/*jshint quotmark:double*/
module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "amd": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "tau": false,
        "taus": false
    },
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "globalReturn": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "rules": {
        "no-caller": "error",
        "no-eval": "error",
        "no-extra-bind": "warn",
        "no-empty": ["error", {"allowEmptyCatch": true}],
        "no-implied-eval": "error",
        "no-lone-blocks": "error",
        "no-lonely-if": "warn",
        "no-loop-func": "error",
        "no-multi-str": "error",
        "no-multiple-empty-lines": ["error", {"max": 2}],
        "no-script-url": "error",
        "no-self-compare": "error",
        "no-throw-literal": "error",
        "no-unexpected-multiline": "error",
        "no-unneeded-ternary": "error",
        "no-unused-vars": "warn",
        "no-use-before-define": ["error", "nofunc"],
        "no-useless-call": "error",
        "no-with": "error",

        "array-bracket-spacing": ["warn", "never"],
        "array-callback-return": "error",
        "brace-style": ["error", "1tbs"],
        "comma-spacing": ["warn", {"before": false, "after": true}],
        "complexity": ["error", 9],
        "consistent-return": "error",
        "curly": ["error", "all"],
        "default-case": "warn",
        "eol-last": "warn",
        "indent": ["error", 4, {"SwitchCase": 1}],
        "keyword-spacing": ["warn"],
        "linebreak-style": "off",
        "max-depth": ["error", 4],
        "max-len": ["warn", 120, 4],
        "max-nested-callbacks": ["error", 4],
        "max-params": ["warn", 5],
        "max-statements": ["error", 50],
        "object-curly-spacing": "error",
        "operator-linebreak": ["warn", "after"],
        "quotes": ["error", "single", {"avoidEscape": true, "allowTemplateLiterals": true}],
        "radix": "error",
        "semi": ["error", "always"],
        "space-before-blocks": "error",
        "space-infix-ops": "warn",
        "yoda": "error"
    }
};
