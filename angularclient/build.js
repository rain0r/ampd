#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const replace = require("replace-in-file");
const versionParser = require("child_process");
const argv = require("yargs")
  .usage("Build the ampd frontend.")
  .option("prod")
  .boolean("prod")
  .default("prod", false)
  .describe("prod", "Is this a production build?")
  .option("url")
  .string("url")
  .describe("url", "The url of the backend server")
  .default("url", "http://localhost:8080")
  .option("https")
  .boolean("https")
  .describe("https", "use https instead of http")
  .default("https", false)
  .option("verbose")
  .boolean("verbose")
  .describe("verbose", "Show ng build output")
  .default("verbose", false)
  .option("context")
  .string("context")
  .describe("context", "The context path of ampd")
  .default("context", "/").argv;

const ampdVersion = versionParser
  .execSync(
    "mvn -q -Dexec.executable=\"echo\" -Dexec.args='${project.version}' --non-recursive exec:exec",
    { cwd: path.join(__dirname, "..") }
  )
  .toString()
  .trim();

const gitCommitId = require("child_process")
  .execSync("git rev-parse --short HEAD")
  .toString()
  .trim();

let http, ws;
if (argv["https"]) {
  http = "https";
  ws = "wss";
} else {
  http = "http";
  ws = "ws";
}

console.log("Building the ampd frontend");
console.log(`Using context path: ${argv["context"]}`);
console.log(`Using versionParser: ${ampdVersion}`);
console.log(`Using prod: ${argv["prod"]}`);
console.log(`Using url: ${argv["url"]}`);
console.log(`Using https: ${argv["https"]}`);
console.log(`Using wss: ${argv["https"]}`);
console.log(`Using gitCommitId: ${gitCommitId}`);

// Copy the environment template
fs.copyFile(
  path.join(__dirname, "src/templates/environment.prod.txt"),
  path.join(__dirname, "src/environments/environment.prod.ts"),
  (err) => {
    if (err) throw err;
  }
);

// Replace some variables

const options = {
  files: path.join(__dirname, "src/environments/environment.prod.ts"),
  from: [
    /R_PROD/,
    /R_AMPD_URL/g,
    /R_HTTP_PROT/,
    /R_WS_PROT/,
    /R_AMPD_VERSION/,
    /R_GIT_COMMIT_ID/,
  ],
  to: [
    `${argv["prod"]}` /* Production mode as str */,
    argv["url"] /* URL of the backendAddr server */,
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
const spawnArgs = argv["prod"]
  ? [
      "build",
      "--progress",
      "--configuration=production",
      `--base-href=${argv["context"]}`,
    ]
  : [
      "build",
      "--progress",
      "--source-map",
      "--prod=false",
      "--build-optimizer=false",
      `--base-href=${argv["context"]}`,
    ];
const spawnOpt = { cwd: __dirname };
const child_process = require("child_process");
run_script("ng", spawnArgs, spawnOpt, function (exit_code) {
  console.log("Process Finished.");
  console.log(`Exit code: ${exit_code}`);
});

// This function will output the lines from the script
// AS is runs, AND will return the full combined output
// as well as exit code when it's done (using the callback).
function run_script(command, args, opts, callback) {
  console.log("Starting Process.");
  console.log("verbose:", argv["verbose"]);
  const child = child_process.spawn(command, args, opts);
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", function (data) {
    if (argv["verbose"]) {
      process.stdout.write(data);
    }
  });

  child.stderr.setEncoding("utf8");
  child.stderr.on("data", function (data) {
    if (argv["verbose"]) {
      process.stdout.write(data);
    }
  });

  child.on("close", function (code) {
    callback(code);
  });
}
