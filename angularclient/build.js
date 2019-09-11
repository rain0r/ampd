const replace = require('replace-in-file');
const spawn = require('child_process').spawn;
var dateFormat = require('dateformat');

const CONTEXT_PATH = '/ampd/';

const prod = process.argv.includes('--prod');

// Write down the build date
const now = new Date();
const options = {
  files: 'src/environments/environment.prod.ts',
  //Replacement to make (string or regex)
  from: /ampdVersion: '.*'/,
  to: `ampdVersion: '${dateFormat(now, "yyyy-mm-dd HH:mm")}'`,
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
