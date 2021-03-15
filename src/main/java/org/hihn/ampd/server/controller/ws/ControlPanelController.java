package org.hihn.ampd.server.controller.ws;

import org.bff.javampd.server.MPD;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class ControlPanelController {


  private static final String PATH = "/control-panel/";

  private final MPD mpd;

  public ControlPanelController(MpdConfiguration mpdConfiguration) {
    mpd = mpdConfiguration.mpd();
  }

  @MessageMapping(PATH + "prev")
  public void prev() {
    mpd.getPlayer().playPrevious();
  }

  @MessageMapping(PATH + "stop")
  public void stop() {
    mpd.getPlayer().stop();
  }

  @MessageMapping(PATH + "pause")
  public void pause() {
    mpd.getPlayer().pause();
  }

  @MessageMapping(PATH + "play")
  public void play() {
    mpd.getPlayer().play();
  }

  @MessageMapping(PATH + "next")
  public void next() {
    mpd.getPlayer().playNext();
  }
}
