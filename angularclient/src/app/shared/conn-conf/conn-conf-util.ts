import { environment } from "../../../environments/environment";
import { ConnConf } from "./conn-conf";

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

  static getBackendAddr(): string {
    const conf = ConnConfUtil.get();
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

  static setBackendAddr(addr: string): void {
    const conf = ConnConfUtil.get();
    conf.backendAddr = addr;
    const data = JSON.stringify(conf);
    localStorage.setItem(ConnConfUtil.key, data);
  }
}
