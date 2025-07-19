import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      require("cypress-grep/src/plugin")(config);
      return config;
    },
  },
});
