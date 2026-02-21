// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
    // Ignore build output and deps
    { ignores: ["dist/**", "node_modules/**"] },

    // Base JS recommended
    js.configs.recommended,

    // TypeScript-aware rules
    ...tseslint.configs.recommended,

    {
        files: ["src/**/*.{ts,tsx}", "tests/**/*.ts"],
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            // React Hooks
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

            // TypeScript – relax a few overly strict defaults
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

            // General code quality
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "prefer-const": "error",
            "no-var": "error",
            eqeqeq: ["error", "always", { null: "ignore" }],
        },
    }
);
