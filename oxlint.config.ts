import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";

export default defineConfig({
  extends: [core],
  ignorePatterns: [
    ...core.ignorePatterns,
    "build/**",
    "playwright-report/**",
    "src/app.d.ts",
    "test-results/**",
  ],
  rules: {
    "eslint/curly": "off",
    "eslint/func-style": "off",
    "eslint/no-await-in-loop": "off",
    "eslint/no-nested-ternary": "off",
    "eslint/no-plusplus": "off",
    "eslint/no-use-before-define": "off",
    "eslint/prefer-const": "off",
    "eslint/require-await": "off",
    "eslint/require-unicode-regexp": "off",
    "eslint/sort-keys": "off",
    "import/consistent-type-specifier-style": "off",
    "import/newline-after-import": "off",
    "promise/prefer-await-to-then": "off",
    "typescript/consistent-type-definitions": "off",
    "unicorn/consistent-function-scoping": "off",
    "unicorn/filename-case": "off",
    "unicorn/no-await-expression-member": "off",
    "unicorn/no-empty-file": "off",
    "unicorn/no-nested-ternary": "off",
    "unicorn/prefer-response-static-json": "off",
    "unicorn/prefer-string-replace-all": "off",
    "unicorn/require-module-specifiers": "off",
  },
});
