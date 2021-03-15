package org.hihn.ampd.server.controller.ws;

import java.util.ArrayList;
import org.bff.javampd.file.MPDFile;
import org.bff.javampd.server.MPD;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class AddTracksController {

  private static final Logger LOG = LoggerFactory.getLogger(AddTracksController.class);

  public static final String PATH = "/add-tracks";

  private final MPD mpd;

  public AddTracksController(MpdConfiguration mpdConfiguration) {
    mpd = mpdConfiguration.mpd();
  }

  @MessageMapping(PATH)
  public void addTracks(ArrayList<String> tracks) {
    LOG.debug("Add tracks {}", tracks);
    for (String file : tracks) {
      MPDFile mpdFile = new MPDFile(file);
      mpdFile.setDirectory(false);
      mpd.getPlaylist().addFileOrDirectory(mpdFile);
    }
  }
}
