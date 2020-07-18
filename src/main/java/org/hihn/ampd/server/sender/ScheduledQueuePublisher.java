package org.hihn.ampd.server.sender;

import org.bff.javampd.server.Mpd;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.message.outgoing.queue.QueueMessage;
import org.hihn.ampd.server.message.outgoing.queue.QueuePayload;
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

  private final Mpd mpd;

  private final SimpMessagingTemplate template;

  @Autowired
  public ScheduledQueuePublisher(final MpdConfiguration mpdConfiguration,
      SimpMessagingTemplate template) {
    mpd = mpdConfiguration.mpd();
    this.template = template;
  }

  /**
   * Publishes the queue every second.
   */
  @Scheduled(fixedDelay = 1 * 1000L)
  public void publishUpdates() {
    if (!mpd.isConnected()) {
      return;
    }

    mpd.getServerStatus().setExpiryInterval(1L); // Tells javampd to get fresh data every second
    final QueuePayload queuePayload = new QueuePayload(mpd.getPlaylist().getSongList());
    final QueueMessage queue = new QueueMessage(queuePayload);
    template.convertAndSend(PUBLISH_URL, queue);
  }
}
