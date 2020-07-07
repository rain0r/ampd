package org.hihn.ampd.server.sender;

import org.bff.javampd.server.Mpd;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.message.incoming.ControlPanel;
import org.hihn.ampd.server.message.outgoing.state.StateMessage;
import org.hihn.ampd.server.message.outgoing.state.StatePayload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Repeatedly sends {@link StatePayload} via {@link #PUBLISH_URL}.
 */
@Component
public class ScheduledStatePublisher {

  private static final String PUBLISH_URL = "/topic/state";

  @Autowired
  private SimpMessagingTemplate template;

  private final Mpd mpd;

  @Autowired
  public ScheduledStatePublisher(MpdConfiguration mpdConfiguration) {
    this.mpd = mpdConfiguration.mpd();
  }

  /**
   * Publishes the Mpd server state every second.
   */
  @Scheduled(fixedDelay = 1 * 1000L)
  public void publishUpdates() {
    if (!mpd.isConnected()) {
      return;
    }

    mpd.getServerStatus().setExpiryInterval(1L); // Tells javampd to get fresh data every second
    ControlPanel controlPanel = new ControlPanel(mpd.getServerStatus());
    StatePayload statePayload =
        new StatePayload(mpd.getServerStatus(), mpd.getPlayer().getCurrentSong(), controlPanel);

    StateMessage message = new StateMessage(statePayload);
    template.convertAndSend(PUBLISH_URL, message);
  }
}
