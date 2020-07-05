package org.hihn.ampd.server.message.incoming;

import java.util.Collection;
import org.bff.javampd.server.ServerStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Represents a MPD control panel.
 */
public class ControlPanel {

  private static final Logger LOG = LoggerFactory.getLogger(ControlPanel.class);

  boolean random = false;

  boolean consume = false;

  boolean single = false;

  boolean crossfade = false;

  boolean repeat = false;

  public ControlPanel(ServerStatus serverStatus) {
    Collection<String> statusList = serverStatus.getStatus();
    setCrossfade(serverStatus.getXFade());

    for (String status : statusList) {

      String[] splitted = status.split(":");
      boolean newValue = "1".equals(splitted[1].trim());

      switch (splitted[0].trim()) {
        case "random":
          setRandom(newValue);
          break;
        case "consume":
          setConsume(newValue);
          break;
        case "single":
          setSingle(newValue);
          break;
        case "repeat":
          setRepeat(newValue);
          break;
        default:
          // Do nothing
      }
    }
  }

  public boolean isRandom() {
    return random;
  }

  public void setRandom(boolean random) {
    this.random = random;
  }

  public boolean isConsume() {
    return consume;
  }

  public void setConsume(boolean consume) {
    this.consume = consume;
  }

  public boolean isSingle() {
    return single;
  }

  public void setSingle(boolean single) {
    this.single = single;
  }

  public boolean isCrossfade() {
    return crossfade;
  }

  public void setCrossfade(boolean crossfade) {
    this.crossfade = crossfade;
  }

  public void setCrossfade(int xfade) {
    setCrossfade(1 == xfade);
  }

  public boolean isRepeat() {
    return repeat;
  }

  public void setRepeat(boolean repeat) {
    this.repeat = repeat;
  }

  /**
   * Returns if xfade is active.
   *
   * @return 1 for active, 0 for inactive.
   */
  public int getXFade() {
    if (this.isCrossfade()) {
      return 1;
    }
    return 0;
  }


}
