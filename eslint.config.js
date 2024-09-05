import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2021
      }
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "semi": ["error", "always"],
      "indent": ["error", 2],
      "no-console": ["error", { allow: ["warn", "info", "trace","error"] }],
      "no-trailing-spaces": "error",
      "camelcase": ["error", { "properties": "always" }],
      "no-duplicate-imports": "error",
      "no-else-return": "error"
    }
  }
];
