// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const AMPD_URL = "localhost:8080";

export const environment = {
  production: true,
  backendAddr: `http://${AMPD_URL}`,
  wsLog: false,
  defaultPageSizeReqParam: 100,
};
