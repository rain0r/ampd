const replace = require('replace-in-file');
const spawn = require('child_process').spawn;

const CONTEXT_PATH = '/ampd/';

const prod = process.argv.includes('--prod');

// Write down the build date
const options = {
  files: 'src/environments/environment.prod.ts',
  //Replacement to make (string or regex)
  from: /REPLACE_AMPD_VERSION/g,
  to: new Date().toISOString(),
};

try {
  replace.sync(options);
} catch (error) {
  console.error('Error occurred:', error);
}

if (prod) {
  spawn('ng', [
    'build',
    '--es5-browser-support',
    '--configuration=production',
    `--base-href=${CONTEXT_PATH}`,
  ]);
} else {
  spawn('ng', [
    'build',
    '--source-map',
    '--prod=false',
    '--build-optimizer=false',
    `--base-href=${CONTEXT_PATH}`,
  ]);
}
