package org.hihn.ampd.server.sender;

import org.bff.javampd.server.MPD;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.message.incoming.ControlPanel;
import org.hihn.ampd.server.message.outgoing.state.StateMessage;
import org.hihn.ampd.server.message.outgoing.state.StatePayload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledUpdatesOnTopic {

  @Autowired
  private SimpMessagingTemplate template;

  private final MPD mpd;

  @Autowired
  public ScheduledUpdatesOnTopic(MpdConfiguration mpdConfiguration) {
    this.mpd = mpdConfiguration.mpd();
  }

  @Scheduled(fixedDelay = 1 * 1000L)
  public void publishUpdates() {
    if (!mpd.isConnected()) {
      return;
    }

    mpd.getServerStatus().setExpiryInterval(1L);
    ControlPanel controlPanel = new ControlPanel(mpd.getServerStatus());
    StatePayload statePayload =
        new StatePayload(mpd.getServerStatus(),
            mpd.getPlayer().getCurrentSong(), controlPanel);

    StateMessage message = new StateMessage(statePayload);
    template.convertAndSend("/topic/messages", message);
  }
}
