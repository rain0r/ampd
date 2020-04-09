#!/usr/bin/env node

const dateFormat = require('dateformat');
const replace = require('replace-in-file');
const spawn = require('child_process').spawn;
const fs = require('fs');
const ampdVersion = require('child_process')
  .execSync(
    'mvn -q -Dexec.executable="echo" -Dexec.args=\'${project.version}\' --non-recursive exec:exec',
    { cwd: '..' }
  )
  .toString()
  .trim();
const argv = require('yargs')
  .usage('Build the ampd frontend.')
  .option('prod')
  .boolean('prod')
  .default('prod', false)
  .describe('prod', 'Is this a production build?')
  .option('url')
  .string('url')
  .describe('url', 'The AMPD_URL')
  .default('url', 'localhost')
  .option('https')
  .boolean('https')
  .describe('https', 'use https instead of http')
  .default('https', false)
  .option('context')
  .string('context')
  .describe('context', 'The context path of ampd')
  .default('context', '/').argv;

// Git commit id
const gitCommitId = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim();

let http, ws;
if (argv['https'] === true) {
  http = 'https';
  ws = 'wss';
} else {
  http = 'http';
  ws = 'ws';
}

console.log(`Using context path: ${argv['context']}`);
console.log(`Using ampdVersion: ${ampdVersion}`);
console.log(`Using prod: ${argv['prod']}`);
console.log(`Using url: ${argv['url']}`);
console.log(`Using http: ${http}`);
console.log(`Using ws: ${ws}`);
console.log(`Using gitCommitId: ${gitCommitId}`);

// Copy the environment template
fs.copyFile(
  'src/templates/environment.prod.ts',
  'src/environments/environment.prod.ts',
  err => {
    if (err) throw err;
  }
);

// Replace some variables
const options = {
  files: 'src/environments/environment.prod.ts',
  from: [
    /R_PROD/,
    /R_AMPD_URL/g,
    /R_HTTP_PROT/,
    /R_WS_PROT/,
    /R_AMPD_VERSION/,
    /R_GIT_COMMIT_ID/,
  ],
  to: [argv['prod'], argv['url'], http, ws, ampdVersion, gitCommitId],
};
try {
  replace.sync(options);
} catch (error) {
  console.error('Error occurred:', error);
}

console.log('Starting build');

let child;

if (argv['prod']) {
  child = spawn('ng', [
    'build',
    '--es5-browser-support',
    '--configuration=production',
    `--base-href=${argv['context']}`,
  ]);
} else {
  child = spawn('ng', [
    'build',
    '--source-map',
    '--prod=false',
    '--build-optimizer=false',
    `--base-href=${argv['context']}`,
  ]);
}

child.on('error', err => {
  console.error(err);
});
