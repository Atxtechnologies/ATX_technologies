// const config = {
//   plugins: ["@tailwindcss/postcss"],
// };

// export default config;
// /


const config = {
  plugins: [
    "@tailwindcss/postcss",
    [
      "postcss-preset-env",
      {
        stage: 1,
        features: {
          "color-function": { unresolved: "warn" },
          "oklab-function": { unresolved: "warn" },
        },
      },
    ],
  ],
};

export default config;
