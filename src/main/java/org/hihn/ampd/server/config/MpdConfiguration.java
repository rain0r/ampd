package org.hihn.ampd.server.config;


import org.bff.javampd.server.Mpd;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * Wrapper around the {@link Mpd} library.
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
   * Builds an {@link Mpd} instance.
   *
   * @return A connection to the MPD server defined in the application.properties.
   */
  public Mpd mpd() {
    if (mpdPassword.equals("")) {
      return new Mpd.Builder().server(mpdServer).port(mpdPort).build();
    } else {
      return new Mpd.Builder().server(mpdServer).port(mpdPort).password(mpdPassword).build();
    }
  }
}
