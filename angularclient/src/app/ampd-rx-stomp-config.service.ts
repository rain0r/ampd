import { InjectableRxStompConfig } from "@stomp/ng2-stompjs";
import { ApiEndpoints } from "./shared/api-endpoints";
import { Injectable } from "@angular/core";
import { Location } from "@angular/common";

@Injectable()
export class AmpdRxStompConfig extends InjectableRxStompConfig {
  constructor(private location: Location) {
    super();
    // Which server?
    this.brokerURL = this.getBrokerUrl();
    // Headers
    // Typical keys: login, passcode, host
    this.connectHeaders = {};
    // How often to heartbeat?
    // Interval in milliseconds, set to 0 to disable
    this.heartbeatIncoming = 0; // Typical value 0 - disabled
    this.heartbeatOutgoing = 1000; // Typical value 20000 - every 20 seconds
    // Wait in milliseconds before attempting auto reconnect
    // Set to 0 to disable
    // Typical value 500 (500 milli seconds)
    this.reconnectDelay = 100;
    // Will log diagnostics on console
    // It can be quite verbose, not recommended in production
    // Skip this key to stop logging to console
    // this.debug = (msg: string): void => {
    //     console.log(new Date(), msg);
    // };
  }

  /**
   * Loads the backendAddr from localStore and converts it into a format that can be used by the
   * websocket library.
   */
  private getBrokerUrl(): string {
    console.log(
      "location.prepareExternalUrl(mpd)",
      this.location.prepareExternalUrl("mpd")
    );

    let brokerUrl = `${ApiEndpoints.getBackendAddr()}${this.location.prepareExternalUrl(
      "mpd"
    )}`;
    if (brokerUrl.includes("https")) {
      brokerUrl = brokerUrl.replace("https", "wss");
    } else {
      brokerUrl = brokerUrl.replace("http", "ws");
    }
    console.log("getBrokerUrl()", brokerUrl);
    return brokerUrl;
  }
}
