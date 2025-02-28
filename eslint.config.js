import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  {
    rules: {
      semi: "error",
      "prefer-const": "warn",
      "no-unused-vars": "warn",
      "no-unused-expressions": "warn",
      "react/prop-types": "off",
      "no-undef": "warn",
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    ignores: [
      ".config/*",
      "dist/*",
      "node_modules/*",
      "public/*",
      "src/*",
      "tailwind.config.js",
      "*.json",
      "*.md",
      "*.yml",
      "*.yaml",
      "*.lock",
      "*.lock.json",
      "*.lock.yaml",
      "*.lock.yml",
      "*.lock.lock",
      "*.lock.lock.json",
      "*.lock.lock.yaml",
      "*.lock.lock.yml",
      "*.lock.lock.lock",
    ],
  },
];
