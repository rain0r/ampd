const replace = require('replace-in-file');
const spawn = require('child_process').spawn;

let prod = process.argv.includes('--prod');
console.log(prod);

const options = {
  files: 'src/environments/environment.prod.ts',
  //Replacement to make (string or regex)
  from: /REPLACE_AMPD_VERSION/g,
  to: new Date().toISOString(),
};

try {
  let changedFiles = replace.sync(options);
} catch (error) {
  console.error('Error occurred:', error);
}

if (prod) {
  spawn('ng', [
    'build',
    '--es5-browser-support',
    '--configuration=production',
    '--base-href=/ampd/',
  ]);
} else {
  spawn('ng', [
    'build',
    '--source-map',
    '--prod=false',
    '--build-optimizer=false',
    '--base-href=/ampd/',
  ]);
}
