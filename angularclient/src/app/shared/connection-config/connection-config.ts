import { environment } from '../../../environments/environment';

export class ConnectionConfig {
  public static readonly key: string = 'ConnectionConfig';

  public static get(): ConnectionConfig {
    let ret: ConnectionConfig;
    try {
      const data: string = localStorage.getItem(ConnectionConfig.key) || '';
      ret = JSON.parse(data) || '';
      if (!ret) {
        throw new Error('ConnectionConfig is null');
      }
    } catch (e) {
      // Fallback: use the data from environment
      ret = new ConnectionConfig(
        environment.coverServer,
        environment.webSocketServer
      );
    }

    return ret;
  }

  constructor(public coverServer: string, public webSocketServer: string) {}
}
