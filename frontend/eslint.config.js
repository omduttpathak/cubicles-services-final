import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  globalIgnores([
    "dist",
    "node_modules",
    "coverage",
    "**/backup*.tsx",
    "**/bkp-*.tsx",
    "**/*.bak.tsx",
  ]),

  {
    files: ["**/*.{ts,tsx}"],

    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      globals: globals.browser,
    },

    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      /*
       * Your project intentionally loads data inside useEffect().
       * Disable this overly-aggressive rule.
       */
      "react-hooks/set-state-in-effect": "off",

      /*
       * Allow exporting hooks, constants and contexts from the
       * same file as React components.
       */
      "react-refresh/only-export-components": "off",
    },
  },
])
