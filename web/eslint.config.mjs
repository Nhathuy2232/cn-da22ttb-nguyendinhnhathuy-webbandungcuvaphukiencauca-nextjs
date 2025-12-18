import nextLintConfig from "eslint-config-next";

export default [
  ...nextLintConfig,
  {
    rules: {
      "@next/next/no-img-element": "off"
    }
  }
];

