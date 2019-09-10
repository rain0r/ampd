package org.hihn.ampd.server.config;

import org.bff.javampd.server.MPD;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MpdConfiguration {

  @Value("${mpd.server}")
  private String mpdServer;

  @Value("${mpd.port}")
  private int mpdPort;

  public MPD mpd() {
    return new MPD.Builder().server(mpdServer).port(mpdPort).build();
  }
}
