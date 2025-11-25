// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const AMPD_URL = "punica:8083/dev-ampd";

export const environment = {
  production: true,
  backendAddr: `http://${AMPD_URL}`,
  wsLog: false,
};
