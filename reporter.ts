const reporter = require("multiple-cucumber-html-reporter");

const env = process.env.ENV || "local";

reporter.generate({
  jsonDir: "reports",
  reportPath: `reports/extent-report-${env}`,   // dynamic path per env
  metadata: {
    browser: { name: "chrome", version: "117" },
    device: "Local Test Machine",
    platform: { name: "Windows", version: "11" },
  },
  customData: {
    title: "Run Info",
    data: [
      { label: "Project", value: "Playwright BDD Framework" },
      { label: "Release", value: "1.0.0" },
      { label: "Environment", value: env },
      { label: "Execution Start Time", value: new Date().toISOString() },
    ],
  },
});
