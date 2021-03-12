// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// const AMPD_URL = "punica:8003";
const AMPD_URL = "punica:8083";
// const AMPD_URL = "192.168.178.50:8080";
// const AMPD_URL = "punica";

export const environment = {
  production: false,
  backendAddr: `http://${AMPD_URL}`,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
