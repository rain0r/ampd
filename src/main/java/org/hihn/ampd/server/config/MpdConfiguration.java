package org.hihn.ampd.server.config;

import org.bff.javampd.server.MPD;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * Wrapper around the {@link MPD} library.
 */
@Configuration
public class MpdConfiguration {

  @Value("${mpd.server}")
  private String mpdServer;

  @Value("${mpd.port}")
  private int mpdPort;

  @Value("${mpd.password:}")
  private String mpdPassword;

  /**
   * Builds an {@link MPD} instance.
   *
   * @return A connection to the MPD server defined in the application.properties.
   */
  public MPD mpd() {
    if (mpdPassword.equals("")) {
      return new MPD.Builder().server(mpdServer).port(mpdPort).build();
    } else {
      return new MPD.Builder().server(mpdServer).port(mpdPort).password(mpdPassword).build();
    }
  }
}
