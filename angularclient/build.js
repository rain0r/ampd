#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const replace = require('replace-in-file');
const spawn = require('child_process').spawn;
const versionParser = require('child_process');
const argv = require('yargs')
  .usage('Build the ampd frontend.')
  .option('prod')
  .boolean('prod')
  .default('prod', false)
  .describe('prod', 'Is this a production build?')
  .option('url')
  .string('url')
  .describe('url', 'The url of the backend server')
  .default('url', 'localhost')
  .option('https')
  .boolean('https')
  .describe('https', 'use https instead of http')
  .default('https', false)
  .option('context')
  .string('context')
  .describe('context', 'The context path of ampd')
  .default('context', '/').argv;

const ampdVersion = versionParser
  .execSync(
    'mvn -q -Dexec.executable="echo" -Dexec.args=\'${project.version}\' --non-recursive exec:exec',
    { cwd: path.join(__dirname, '..') }
  )
  .toString()
  .trim();

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
console.log(`Using versionParser: ${ampdVersion}`);
console.log(`Using prod: ${argv['prod']}`);
console.log(`Using url: ${argv['url']}`);
console.log(`Using http: ${http}`);
console.log(`Using ws: ${ws}`);
console.log(`Using gitCommitId: ${gitCommitId}`);

// Copy the environment template
fs.copyFile(
  path.join(__dirname, 'src/templates/environment.prod.txt'),
  path.join(__dirname, 'src/environments/environment.prod.ts'),
  err => {
    if (err) throw err;
  }
);

// Replace some variables

const options = {
  files: path.join(__dirname, 'src/environments/environment.prod.ts'),
  from: [
    /R_PROD/,
    /R_AMPD_URL/g,
    /R_HTTP_PROT/,
    /R_WS_PROT/,
    /R_AMPD_VERSION/,
    /R_GIT_COMMIT_ID/,
  ],
  to: [
    `${argv['prod']}` /* Production mode as str */,
    argv['url'] /* URL of the backendAddr server */,
    http /* http || https */,
    ws /* ws || wss */,
    ampdVersion /* ampd version */,
    gitCommitId /* git commit */,
  ],
};
try {
  replace.sync(options);
} catch (err) {
  throw err;
}

console.log('Starting build');
const spawnArgs = argv['prod']
  ? ['build', '--configuration=production', `--base-href=${argv['context']}`]
  : [
      'build',
      '--source-map',
      '--prod=false',
      '--build-optimizer=false',
      `--base-href=${argv['context']}`,
    ];

const spawnOpt = { cwd: __dirname };
const child = spawn('ng', spawnArgs, spawnOpt);

child.stdout.on('data', data => {
  console.log(`stdout: ${data}`);
});

child.stderr.on('data', data => {
  console.error(`stderr: ${data}`);
});

child.on('close', code => {
  console.log(`child process exited with code ${code}`);
  if (code > 0) {
    process.exit(1);
  }
});

child.on('error', err => {
  console.error(err);
  process.exit(1);
});
