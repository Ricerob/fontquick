module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["warn", "double"],
    "import/no-unresolved": 0,
    "indent": ["warn", 4],
    "new-cap": "warn",
    "semi": "warn",
    "comma-dangle": "warn",
    "object-curly-spacing": "warn",
    "require-jsdoc": "warn",
    "@typescript-eslint/ban-types": "warn",
    "padded-blocks": "warn",
    "max-len": "warn"
  },
};
