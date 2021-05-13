import { environment } from "../../environments/environment";
import { KEY_BACKEND_ADDRESS } from "./local-storage-keys";

export class ApiEndpoints {
  /**
   * Returns the base backend address, not taking a potential context into account.
   * In development mode we're running on http://localhost:4200 which can't be used as a backend address.
   * If the user somehow decided to change the backend address to a different value, we return this value from
   * localStorage.
   */
  static getBackendAddr(): string {
    let backendAddr: string;
    if (environment.production) {
      backendAddr =
        localStorage.getItem(KEY_BACKEND_ADDRESS) || window.location.origin;
    } else {
      backendAddr = environment.backendAddr;
    }
    return backendAddr;
  }
}
