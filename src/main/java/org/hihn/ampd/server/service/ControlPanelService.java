package org.hihn.ampd.server.service;

import java.util.HashMap;
import org.bff.javampd.server.Mpd;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Represents the control panel of Mpd.
 */
@Service
public class ControlPanelService {

  private final Mpd mpd;

  @Autowired
  public ControlPanelService(MpdConfiguration mpdConfiguration) {
    this.mpd = mpdConfiguration.mpd();
  }

  /**
   * Sets the state of the control panel.
   *
   * @param incomingPayload The new control panel state.
   */
  public void applyControlPanelChanges(Object incomingPayload) {
    HashMap<String, HashMap<String, Boolean>> payload =
        (HashMap<String, HashMap<String, Boolean>>) incomingPayload;
    HashMap<String, Boolean> controlPanel = payload.get("controlPanel");

    boolean random = controlPanel.get("random");
    boolean repeat = controlPanel.get("repeat");
    int xfade = controlPanel.get("crossfade") ? 1 : 0;
    boolean consume = controlPanel.get("consume");
    boolean single = controlPanel.get("single");

    mpd.getPlayer().setRandom(random);
    mpd.getPlayer().setRepeat(repeat);
    mpd.getPlayer().setXFade(xfade);
    mpd.getPlayer().setConsume(consume);
    mpd.getPlayer().setSingle(single);
  }

}
