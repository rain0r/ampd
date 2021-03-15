package org.hihn.ampd.server.controller.ws;

import org.bff.javampd.server.MPD;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.message.AmpdMessage.MessageType;
import org.hihn.ampd.server.message.outgoing.queue.QueueMessage;
import org.hihn.ampd.server.message.outgoing.queue.QueuePayload;
import org.hihn.ampd.server.model.AmpdSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class QueueController {

  private final MPD mpd;

  private static final Logger LOG = LoggerFactory.getLogger(ControlPanelController.class);

  private static final String PATH = "/queue";

  private static final String QUEUE_CLEAR_PATH = "/queue/clear";

  private final AmpdSettings ampdSettings;

  public QueueController(MpdConfiguration mpdConfiguration,
      AmpdSettings ampdSettings) {
    mpd = mpdConfiguration.mpd();
    this.ampdSettings = ampdSettings;
  }

  @MessageMapping(PATH)
  @SendTo("/topic" + PATH)
  public QueueMessage getQueue() {
    LOG.debug("Received: {}", MessageType.GET_QUEUE);
    QueuePayload queuePayload = new QueuePayload(mpd.getPlaylist().getSongList());
    QueueMessage queue = new QueueMessage(queuePayload);
    return queue;
  }


  @MessageMapping(QUEUE_CLEAR_PATH)
  public void clearQueue() {
    mpd.getPlaylist().clearPlaylist();
    if (ampdSettings.isResetModesOnClear()) {
      mpd.getPlayer().setRandom(false);
      mpd.getPlayer().setRepeat(false);
      mpd.getPlayer().setXFade(0);
      mpd.getPlayer().setConsume(false);
      mpd.getPlayer().setSingle(false);
    }
  }
}
