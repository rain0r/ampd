import { environment } from "../../../environments/environment";
import { ConnectionConfig } from "./connection-config";

/**
 * Manages the connection info. Saves the address of the backendAddr.
 */
export class ConnectionConfigUtil {
  /**
   * The key used in localStorage.
   * @type {string}
   */
  static readonly key: string = "ConnectionConfig";

  /**
   * Used to identify the backendAddr in the connection config.
   * @type {string}
   */
  static readonly backendAddrKey: string = "backendAddr";

  static get(): ConnectionConfig {
    let ret: ConnectionConfig;
    const data: string = localStorage.getItem(ConnectionConfigUtil.key) || "";
    ret = <ConnectionConfig>JSON.parse(data) || "";
    if (!ret) {
      ret = new ConnectionConfig(environment.backendAddr);
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
