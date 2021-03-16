package org.hihn.ampd.server.controller.ws;

import org.bff.javampd.server.MPD;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.message.incoming.MpdModesPanel;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@MessageMapping("/control-panel/")
public class ControlPanelController {

  private final MPD mpd;

  public ControlPanelController(MpdConfiguration mpdConfiguration) {
    mpd = mpdConfiguration.mpd();
  }

  @MessageMapping("prev")
  public void prev() {
    mpd.getPlayer().playPrevious();
  }

  @MessageMapping("stop")
  public void stop() {
    mpd.getPlayer().stop();
  }

  @MessageMapping("pause")
  public void pause() {
    mpd.getPlayer().pause();
  }

  @MessageMapping("play")
  public void play() {
    mpd.getPlayer().play();
  }

  @MessageMapping("next")
  public void next() {
    mpd.getPlayer().playNext();
  }

  @MessageMapping("seek")
  public void seek(int value) {
    mpd.getPlayer().seek(value);
  }

  @MessageMapping("/volume")
  public void setVolume(int volume) {
    mpd.getPlayer().setVolume(volume);
  }

  @MessageMapping("mpd-modes-panel")
  public void toggleMpdModes(MpdModesPanel mpdModesPanel) {
    mpd.getPlayer().setRandom(mpdModesPanel.isRandom());
    mpd.getPlayer().setRepeat(mpdModesPanel.isRepeat());
    mpd.getPlayer().setXFade((mpdModesPanel.isCrossfade() ? 1 : 0));
    mpd.getPlayer().setConsume(mpdModesPanel.isConsume());
    mpd.getPlayer().setSingle(mpdModesPanel.isSingle());
  }
}
