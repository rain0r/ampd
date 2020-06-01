import {environment} from "../../../environments/environment";
import {ConnConf} from "./conn-conf";

/**
 * Manages the connection info. Saves the address of the backendAddr.
 */
export class ConnectionConfigUtil {
  /**
   * The key used in localStorage.
   * @type {string}
   */
  static readonly key: string = "ConnConf";

  /**
   * Used to identify the backendAddr in the connection config.
   * @type {string}
   */
  static readonly backendAddrKey: string = "backendAddr";

  static get(): ConnConf {
    let ret: ConnConf;
    const data: string = localStorage.getItem(ConnectionConfigUtil.key) || "";
    try {
      ret = <ConnConf>JSON.parse(data);
    }
    catch (err) {
      ret = new ConnConf(environment.backendAddr);
    }
    return ret;
  }

  static getWebSocketAddr(): string {
    const conf = ConnectionConfigUtil.get();
    let ret = "";

    if (conf.backendAddr.includes("https")) {
      ret = conf.backendAddr.replace("https", "wss");
    } else {
      ret = conf.backendAddr.replace("http", "ws");
    }
    if (!ret.endsWith("/")) {
      ret += "/";
    }
    ret += "mpd";
    return ret;
  }
}
