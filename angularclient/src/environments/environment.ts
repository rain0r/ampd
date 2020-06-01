// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// const AMPD_URL = "punica:8080";
const AMPD_URL = "punicaX:8080";

export const environment = {
  production: false,
  backendAddr: `http://${AMPD_URL}`,
  webSocketAddr: `ws://${AMPD_URL}/mpd`,
  ampdVersion: "live",
  gitCommitId: "live",
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
