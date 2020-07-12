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

  boolean consume;

  boolean crossfade;

  boolean random;

  boolean repeat;

  boolean single;

  public ControlPanel(final ServerStatus serverStatus) {
    final Collection<String> statusList = serverStatus.getStatus();
    setCrossfade(serverStatus.getCrossfade());

    for (final String status : statusList) {
      final String[] splitted = status.split(":");
      final boolean newValue = "1".equals(splitted[1].trim());

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

  /**
   * Returns if xfade is active.
   *
   * @return 1 for active, 0 for inactive.
   */
  public int getXFade() {
    if (isCrossfade()) {
      return 1;
    }
    return 0;
  }

  public boolean isConsume() {
    return consume;
  }

  public void setConsume(final boolean consume) {
    this.consume = consume;
  }

  public boolean isCrossfade() {
    return crossfade;
  }

  public void setCrossfade(final boolean crossfade) {
    this.crossfade = crossfade;
  }

  public void setCrossfade(final int xfade) {
    setCrossfade(1 == xfade);
  }

  public boolean isRandom() {
    return random;
  }

  public void setRandom(final boolean random) {
    this.random = random;
  }

  public boolean isRepeat() {
    return repeat;
  }

  public void setRepeat(final boolean repeat) {
    this.repeat = repeat;
  }

  public boolean isSingle() {
    return single;
  }

  public void setSingle(final boolean single) {
    this.single = single;
  }


}
