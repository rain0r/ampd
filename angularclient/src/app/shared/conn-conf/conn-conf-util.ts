import { environment } from "../../../environments/environment";

import { InjectableRxStompConfig } from "@stomp/ng2-stompjs";

/**
 * Manages the connection info. Saves the address of the backendAddr.
 */
export class ConnConfUtil {
  /**
   * The key used in localStorage.
   * @type {string}
   */
  static readonly key: string = "ConnConf";

  /**
   * Returns the api endpoint of the backend that looks for covers in a directory specified by
   * a directory path.
   */
  static getFindDirCoverUrl(): string {
    const currentCoverUrl = "find-dir-cover";
    return `${ConnConfUtil.getBackendAddr()}/${currentCoverUrl}`;
  }

  /**
   * Returns the api endpoint of the backend that looks for covers in a directory specified by
   * a track path.
   */
  static getFindTrackCoverUrl(): string {
    const currentCoverUrl = "find-dir-cover";
    return `${ConnConfUtil.getBackendAddr()}/${currentCoverUrl}`;
  }

  static getBackendAddr(): string {
    let backendAddr = localStorage.getItem(ConnConfUtil.key) || "";
    if (!backendAddr) {
      backendAddr = environment.backendAddr;
    }
    return backendAddr;
  }

  /**
   * Loads the backendAddr from localStore and converts it into a format that can be used by the
   * websocket library.
   */
  static getBrokerUrl(): string {
    const backendAddr = ConnConfUtil.getBackendAddr();
    let ret: string;
    if (backendAddr.includes("https")) {
      ret = backendAddr.replace("https", "wss");
    } else {
      ret = backendAddr.replace("http", "ws");
    }
    if (!ret.endsWith("/")) {
      ret = `${ret}/`;
    }
    ret = `${ret}mpd`;
    return ret;
  }

  static setBackendAddr(addr: string): void {
    localStorage.setItem(ConnConfUtil.key, addr);
  }

  static loadStompConfig(): InjectableRxStompConfig {
    const myRxStompConfig: InjectableRxStompConfig = <InjectableRxStompConfig>{
      // Which server?
      brokerURL: ConnConfUtil.getBrokerUrl(),
      // Headers
      // Typical keys: login, passcode, host
      connectHeaders: {},
      // How often to heartbeat?
      // Interval in milliseconds, set to 0 to disable
      heartbeatIncoming: 0, // Typical value 0 - disabled
      heartbeatOutgoing: 1000, // Typical value 20000 - every 20 seconds
      // Wait in milliseconds before attempting auto reconnect
      // Set to 0 to disable
      // Typical value 500 (500 milli seconds)
      reconnectDelay: 100,
      // Will log diagnostics on console
      // It can be quite verbose, not recommended in production
      // Skip this key to stop logging to console
      // debug: (msg: string): void => {
      //   console.log(new Date(), msg);
      // },
    };
    return myRxStompConfig;
  }
}
