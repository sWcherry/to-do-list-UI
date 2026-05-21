import { defineConfig } from "cypress";
import registerCodeCoverageTasks from '@cypress/code-coverage/task';

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      registerCodeCoverageTasks(on, config);
      return config;
    },
  },
});
