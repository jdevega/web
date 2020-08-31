/* eslint-disable @typescript-eslint/no-var-requires */
const { runTests } = require('@web/test-runner-core/test-helpers');
const { legacyPlugin } = require('@web/dev-server-legacy');
const { resolve } = require('path');

const { createSauceLabsLauncher } = require('../dist/index');

const sauceLabsLauncher = createSauceLabsLauncher({
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  region: 'eu-central-1',
});

const sharedCapabilities = {
  'sauce:options': {
    build: `modern-web ${process.env.GITHUB_REF ?? 'local'} build ${
      process.env.GITHUB_RUN_NUMBER ?? ''
    }`,
    name: 'integration test',
  },
};

it('runs tests on saucelabs', async function () {
  this.timeout(100000);

  const runner = await runTests(
    {
      browsers: [
        // sauceLabsLauncher({
        //   ...sharedCapabilities,
        //   browserName: 'chrome',
        //   browserVersion: 'latest',
        //   platformName: 'Windows 10',
        // }),
        // sauceLabsLauncher({
        //   ...sharedCapabilities,
        //   browserName: 'firefox',
        //   browserVersion: '80.0',
        //   platformName: 'Windows 10',
        // }),
        // sauceLabsLauncher({
        //   ...sharedCapabilities,
        //   browserName: 'safari',
        //   browserVersion: '12.0',
        //   platformName: 'macOS 10.14',
        // }),
        sauceLabsLauncher({
          ...sharedCapabilities,
          browserName: 'internet explorer',
          browserVersion: '11.0',
          platformName: 'Windows 7',
        }),
      ],
      plugins: [legacyPlugin()],
      concurrency: 1,
    },
    [
      resolve(__dirname, 'fixtures', 'a.js'),
      resolve(__dirname, 'fixtures', 'b.js'),
      resolve(__dirname, 'fixtures', 'c.js'),
      resolve(__dirname, 'fixtures', 'd.js'),
      resolve(__dirname, 'fixtures', 'e.js'),
      resolve(__dirname, 'fixtures', 'stage-4-features.js'),
      resolve(__dirname, 'fixtures', 'module-features.js'),
    ],
  );

  runner.sessions.all();
});
