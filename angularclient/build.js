const dateFormat = require('dateformat');
const replace = require('replace-in-file');
const spawn = require('child_process').spawn;

const CONTEXT_PATH = '/';
const prod = process.argv.includes('--prod');
let ampdVersion = require('child_process')
.execSync('mvn -q -Dexec.executable="echo" -Dexec.args=\'${project.version}\' --non-recursive exec:exec',
    {cwd: '..'},)
.toString().trim();

if (prod) {
  ampdVersion = ampdVersion.replace('-SNAPSHOT', '');
}

// Git hash
const revision = require('child_process')
.execSync('git rev-parse --short HEAD')
.toString().trim();

// Write down the build date
const options = {
  files: 'src/environments/environment.prod.ts',
  from: [/ampdVersion: '.*'/, /gitCommitId: '.*',/],
  to: [`ampdVersion: '${ampdVersion}'`, `gitCommitId: '${revision}'`],
};

console.log(`Using CONTEXT_PATH ${CONTEXT_PATH}`);
console.log(`Using ampdVersion ${ampdVersion}`);
console.log(`Using git commit ${revision}`);

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
  console.error(err);
});
