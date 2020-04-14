import { environment } from '../../../environments/environment';

/**
 * Manages the connection info. Saves the address of the backendAddr.
 */
export class ConnectionConfig {
  /**
   * The key used in localStorage.
   * @type {string}
   */
  public static readonly key: string = 'ConnectionConfig';

  /**
   * Used to identify the backendAddr in the connection config.
   * @type {string}
   */
  public static readonly backendAddrKey: string = 'backendAddr';

  /**
   * The old key of the backend addr in the connection config.
   * @deprecated
   * @type {string}
   */
  public static readonly coverServer: string = 'coverServer';

  public static get(): ConnectionConfig {
    let ret: ConnectionConfig;
    try {
      const data: string = localStorage.getItem(ConnectionConfig.key) || '';
      ret = JSON.parse(data) || '';
      if (!ret) {
        throw new Error('ConnectionConfig is null');
      }
      // Check if the old format is still in use
      if (ConnectionConfig.coverServer in ret) {
        ret[ConnectionConfig.backendAddrKey] =
          ret[ConnectionConfig.coverServer];
        delete ret[ConnectionConfig.coverServer];
      }
    } catch (e) {
      // Fallback: use the data from environment
      ret = new ConnectionConfig(environment.backendAddr);
    }
    return ret;
  }

  public static getWebSocketAddr(): string {
    const conf = ConnectionConfig.get();
    let ret = '';

    if (conf.backendAddr.includes('https')) {
      ret = conf.backendAddr.replace('https', 'wss');
    } else {
      ret = conf.backendAddr.replace('http', 'ws');
    }
    if (!ret.endsWith('/')) {
      ret += '/';
    }
    ret += 'mpd';
    return ret;
  }

  constructor(public backendAddr: string) {}
}
