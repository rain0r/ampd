package org.hihn.ampd.server.controller.ws;

import org.bff.javampd.server.MPD;
import org.hihn.ampd.server.message.incoming.MpdModesPanel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

/**
 * Websocket endpoint to control the actual player. Provides endpoints for basic functions like play
 * next or toggle shuffle.
 */
@Controller
@MessageMapping("/control-panel/")
public class ControlPanelController {

  @Autowired
  private final MPD mpd;

  public ControlPanelController(MPD mpd) {
    this.mpd = mpd;
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

  /**
   * Takes an {@link MpdModesPanel} and applies it on the MPD server.
   *
   * @param mpdModesPanel The new modes that should be applied.
   */
  @MessageMapping("mpd-modes-panel")
  public void toggleMpdModes(MpdModesPanel mpdModesPanel) {
    mpd.getPlayer().setRandom(mpdModesPanel.isRandom());
    mpd.getPlayer().setRepeat(mpdModesPanel.isRepeat());
    mpd.getPlayer().setXFade((mpdModesPanel.isCrossfade() ? 1 : 0));
    mpd.getPlayer().setConsume(mpdModesPanel.isConsume());
    mpd.getPlayer().setSingle(mpdModesPanel.isSingle());
  }
}
