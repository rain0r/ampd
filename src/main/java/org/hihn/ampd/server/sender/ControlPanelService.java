package org.hihn.ampd.server.sender;

import org.bff.javampd.server.MPD;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.message.AmpdMessage.MessageType;
import org.springframework.stereotype.Service;

@Service
public class ControlPanelService {

  private final MPD mpd;

  public ControlPanelService(MpdConfiguration mpdConfiguration) {
    mpd = mpdConfiguration.mpd();
  }

  public void handle(MessageType messageType) {
    switch (messageType) {
      case SET_PREV:
        playPrevious();
        break;
      case SET_STOP:
        stop();
        break;
      case SET_PAUSE:
        pause();
        break;
      case SET_PLAY:
        play();
        break;
      case SET_NEXT:
        playNext();
        break;
    }
  }

  public void pause() {
    mpd.getPlayer().pause();
  }

  public void play() {
    mpd.getPlayer().play();
  }

  public void playNext() {
    mpd.getPlayer().playNext();
  }

  public void playPrevious() {
    mpd.getPlayer().playPrevious();
  }

  public void stop() {
    mpd.getPlayer().stop();
  }
}
