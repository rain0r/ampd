package org.hihn.ampd.server.controller.ws;

import java.util.ArrayList;
import java.util.Collection;
import org.bff.javampd.file.MPDFile;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.message.outgoing.queue.QueueMessage;
import org.hihn.ampd.server.message.outgoing.queue.QueuePayload;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.service.QueueService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@MessageMapping("/queue")
public class QueueController {

  private final MPD mpd;

  private final AmpdSettings ampdSettings;

  private final QueueService queueService;


  public QueueController(MpdConfiguration mpdConfiguration,
      AmpdSettings ampdSettings, QueueService queueService) {
    mpd = mpdConfiguration.mpd();
    this.ampdSettings = ampdSettings;
    this.queueService = queueService;
  }

  @MessageMapping("/")
  @SendTo("/topic/queue")
  public QueueMessage getQueue() {
    QueuePayload queuePayload = new QueuePayload(mpd.getPlaylist().getSongList());
    QueueMessage queue = new QueueMessage(queuePayload);
    return queue;
  }


  @MessageMapping("/clear")
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

  @MessageMapping("/add-tracks")
  public void addTracks(ArrayList<String> tracks) {
    queueService.addTracks(tracks);
  }


  @MessageMapping("/add-dir")
  public void addDir(String dir) {
    MPDFile mpdFile = new MPDFile(dir);
    mpd.getPlaylist().addFileOrDirectory(mpdFile);
  }

  @MessageMapping("/add-playlist")
  public void addPlaylist(String playlist) {
    Collection<MPDSong> mpdSongCollection =
        mpd.getMusicDatabase().getPlaylistDatabase().listPlaylistSongs(playlist);
    ArrayList<MPDSong> mpdTracks = new ArrayList<>(mpdSongCollection);
    mpd.getPlaylist().addSongs(mpdTracks);
  }


  @MessageMapping("/add-play-track")
  public void addPlayTrack(String file) {
    queueService.addTrack(file);
    queueService.playTrack(file);
  }

  @MessageMapping("/add-remove-track")
  public void removeTrack(int position) {
    mpd.getPlaylist().removeSong(position);
  }

  @MessageMapping("/play-track")
  public void playTrack(String file) {
    queueService.playTrack(file);
  }

}
