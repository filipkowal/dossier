import nextConfig from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextConfig,
  {
    settings: {
      "import/resolver": {
        typescript: {},
      },
    },
  },
];

export default eslintConfig;
