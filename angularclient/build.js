const replace = require('replace-in-file');
const spawn = require('child_process').spawn;
const dateFormat = require('dateformat');

const CONTEXT_PATH = '/';

const prod = process.argv.includes('--prod');

// Git hash
const revision = require('child_process')
.execSync('git rev-parse HEAD')
.toString().trim();

console.log(`Using git commit ${revision}`);

// Write down the build date
const now = new Date();
const options = {
  files: 'src/environments/environment.prod.ts',
  //Replacement to make (string or regex)
  from: /ampdVersion: '.*'/,
  to: `ampdVersion: '${dateFormat(now, "yyyy-mm-dd HH:MM")} (${revision})'`,
};

console.log(`ampdVersion ${dateFormat(now, "yyyy-mm-dd HH:MM")}`);

try {
  replace.sync(options);
} catch (error) {
  console.error('Error occurred:', error);
}

console.log('Starting build');

let child;

if (prod) {
  child = spawn('ng', [
    'build',
    '--es5-browser-support',
    '--configuration=production',
    `--base-href=${CONTEXT_PATH}`,
  ]);
} else {
  child = spawn('ng', [
    'build',
    '--source-map',
    '--prod=false',
    '--build-optimizer=false',
    `--base-href=${CONTEXT_PATH}`,
  ]);
}

child.on('error', (err) => {
  console.log('Oh noez, teh errurz: ' + err);
});
