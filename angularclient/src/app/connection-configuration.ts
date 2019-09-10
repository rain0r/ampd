import { environment } from '../environments/environment';

export class ConnectionConfiguration {
  static readonly key: string = 'ConnectionConfiguration';

  constructor(public coverServer: string, public webSocketServer: string) {}

  static get(): ConnectionConfiguration {
    let ret: ConnectionConfiguration;
    try {
      const data: string =
        localStorage.getItem(ConnectionConfiguration.key) || '';
      ret = JSON.parse(data) || '';
      if (!ret) {
        throw new Error('ConnectionConfiguration is null');
      }
    } catch (e) {
      // Fallback: use the data from environment
      ret = new ConnectionConfiguration(
        environment.coverServer,
        environment.webSocketServer
      );
    }

    return ret;
  }
}
