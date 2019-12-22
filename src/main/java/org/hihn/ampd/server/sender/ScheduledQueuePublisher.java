package org.hihn.ampd.server.sender;

import org.bff.javampd.server.MPD;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.message.incoming.ControlPanel;
import org.hihn.ampd.server.message.outgoing.Queue;
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
public class ScheduledQueuePublisher {

  private static final String PUBLISH_URL = "/topic/queue";

  @Autowired private SimpMessagingTemplate template;

  private final MPD mpd;

  @Autowired
  public ScheduledQueuePublisher(MpdConfiguration mpdConfiguration) {
    this.mpd = mpdConfiguration.mpd();
  }

  @Scheduled(fixedDelay = 1 * 1000L)
  public void publishUpdates() {
    if (!mpd.isConnected()) {
      return;
    }

    Queue queue = new Queue(mpd.getPlaylist().getSongList());
    template.convertAndSend(PUBLISH_URL, queue);
  }
}
