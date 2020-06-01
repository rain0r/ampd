import { environment } from "../../../environments/environment";
import { ConnConf } from "./conn-conf";
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

  static get(): ConnConf {
    let ret: ConnConf;
    const data: string = localStorage.getItem(ConnConfUtil.key) || "";
    try {
      ret = <ConnConf>JSON.parse(data);
    } catch (err) {
      ret = new ConnConf(environment.backendAddr);
    }
    return ret;
  }

  static getBrokerUrl(): string {
    const conf: ConnConf = ConnConfUtil.get();
    let ret = "";

    if (conf.backendAddr.includes("https")) {
      ret = conf.backendAddr.replace("https", "wss");
    } else {
      ret = conf.backendAddr.replace("http", "ws");
    }

    if (!ret.endsWith("/")) {
      ret = `${ret}/`;
    }

    ret = `${ret}mpd`;

    return ret;
  }

  static getBackendAddr(): string {
    const conf = ConnConfUtil.get();
    return conf.backendAddr;
    // http://punica:8080
  }

  static setBackendAddr(addr: string): void {
    const conf = ConnConfUtil.get();
    conf.backendAddr = addr;
    const data = JSON.stringify(conf);
    localStorage.setItem(ConnConfUtil.key, data);
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
      // }
    };
    return myRxStompConfig;
  }
}
