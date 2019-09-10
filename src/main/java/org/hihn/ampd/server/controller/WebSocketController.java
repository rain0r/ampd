package org.hihn.ampd.server.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.TreeSet;
import java.util.stream.Collectors;
import org.bff.javampd.file.MPDFile;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.message.AmpdMessage;
import org.hihn.ampd.server.message.Message;
import org.hihn.ampd.server.message.incoming.IncomingMessage;
import org.hihn.ampd.server.message.outgoing.Queue;
import org.hihn.ampd.server.message.outgoing.browse.BrowseMessage;
import org.hihn.ampd.server.message.outgoing.browse.BrowsePayload;
import org.hihn.ampd.server.message.outgoing.browse.Playlist;
import org.hihn.ampd.server.service.SearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

  private static final Logger LOG = LoggerFactory.getLogger(WebSocketController.class);

  private final MPD mpd;

  private final EnumMap<AmpdMessage.MESSAGE_TYPE, AmpdCommandRunner> commands =
      new EnumMap<>(AmpdMessage.MESSAGE_TYPE.class);


  private final SearchService searchService;

  @Autowired
  public WebSocketController(MpdConfiguration mpdConfiguration, SearchService searchService) {
    this.mpd = mpdConfiguration.mpd();
    this.searchService = searchService;

    commands.put(AmpdMessage.MESSAGE_TYPE.ADD_DIR, this::addDir);
    commands.put(AmpdMessage.MESSAGE_TYPE.ADD_PLAYLIST, this::addPlaylist);
    commands.put(AmpdMessage.MESSAGE_TYPE.ADD_PLAY_TRACK, this::addPlayTrack);
    commands.put(AmpdMessage.MESSAGE_TYPE.ADD_TRACK, this::addTrack);
    commands.put(AmpdMessage.MESSAGE_TYPE.GET_BROWSE, this::browse);
    commands.put(AmpdMessage.MESSAGE_TYPE.GET_QUEUE, this::getQueue);
    commands.put(AmpdMessage.MESSAGE_TYPE.PLAY_TRACK, this::playTrack);
    commands.put(AmpdMessage.MESSAGE_TYPE.RM_ALL, this::removeAll);
    commands.put(AmpdMessage.MESSAGE_TYPE.RM_TRACK, this::removeTrack);
    commands.put(AmpdMessage.MESSAGE_TYPE.SEARCH, this::search);
    commands.put(AmpdMessage.MESSAGE_TYPE.SET_NEXT, this::playNext);
    commands.put(AmpdMessage.MESSAGE_TYPE.SET_PAUSE, this::pause);
    commands.put(AmpdMessage.MESSAGE_TYPE.SET_PLAY, this::play);
    commands.put(AmpdMessage.MESSAGE_TYPE.SET_PREV, this::playPrevious);
    commands.put(AmpdMessage.MESSAGE_TYPE.SET_SEEK, this::seek);
    commands.put(AmpdMessage.MESSAGE_TYPE.SET_STOP, this::stop);
    commands.put(AmpdMessage.MESSAGE_TYPE.SET_VOLUME, this::setVolume);
    commands.put(AmpdMessage.MESSAGE_TYPE.TOGGLE_CONTROL, this::toggleControlPanel);
  }

  @MessageMapping("/mpd")
  @SendTo("/topic/messages")
  public Optional<Message> send(IncomingMessage incomingMessage) {
    Optional<Message> outgoingMessage = Optional.empty();
    try {
      outgoingMessage = commands.get(incomingMessage.getType()).run(incomingMessage.getPayload());
    } catch (Exception e) {
      LOG.error("Error processing " + incomingMessage.getType());
      LOG.error(e.getMessage(), e);
    }

    return outgoingMessage;
  }

  private Optional<Message> search(Object pPayload) {
    HashMap<String, String> payload = (HashMap<String, String>) pPayload;
    String query = payload.get("query");

    return Optional.of(searchService.search(query));
  }

  private Optional<Message> addPlaylist(Object pPayload) {
    HashMap<String, String> payload = (HashMap<String, String>) pPayload;
    String playlist = payload.get("playlist");
    ArrayList<MPDSong> mpdSongs = new ArrayList<>();

    Collection<MPDSong> mpdSongCollection =
        mpd.getMusicDatabase().getPlaylistDatabase().listPlaylistSongs(playlist);

    mpdSongs.addAll(mpdSongCollection);

    mpd.getPlaylist().addSongs(mpdSongs);
    return Optional.empty();
  }

  private Optional<Message> addTrack(Object pPayload) {
    HashMap<String, String> payload = (HashMap<String, String>) pPayload;
    String path = payload.get("path");
    MPDFile mpdFile = new MPDFile(path);
    mpdFile.setDirectory(false);
    mpd.getPlaylist().addFileOrDirectory(mpdFile);
    return Optional.empty();
  }

  private Optional<Message> addPlayTrack(Object pPayload) {
    addTrack(pPayload);
    playTrack(pPayload);
    return Optional.empty();
  }

  private Optional<Message> playNext(Object o) {
    mpd.getPlayer().playNext();
    return Optional.empty();
  }

  private Optional<Message> play(Object o) {
    mpd.getPlayer().play();
    return Optional.empty();
  }

  private Optional<Message> pause(Object o) {
    mpd.getPlayer().pause();
    return Optional.empty();
  }

  private Optional<Message> stop(Object o) {
    mpd.getPlayer().stop();
    return Optional.empty();
  }

  private Optional<Message> playPrevious(Object o) {
    mpd.getPlayer().playPrevious();
    return Optional.empty();
  }

  private Optional<Message> seek(Object pPayload) {
    HashMap<String, Integer> payload = (HashMap<String, Integer>) pPayload;
    int value = payload.get("value");
    mpd.getPlayer().seek(value);
    return Optional.empty();
  }

  private Optional<Message> toggleControlPanel(Object pPayload) {
    HashMap<String, HashMap<String, Boolean>> payload =
        (HashMap<String, HashMap<String, Boolean>>) pPayload;
    HashMap<String, Boolean> controlPanel = payload.get("controlPanel");

    boolean random = controlPanel.get("random");
    boolean repeat = controlPanel.get("repeat");
    int xFade = controlPanel.get("crossfade") ? 1 : 0;
    boolean consume = controlPanel.get("consume");
    boolean single = controlPanel.get("single");

    mpd.getPlayer().setRandom(random);
    mpd.getPlayer().setRepeat(repeat);
    mpd.getPlayer().setXFade(xFade);
    mpd.getPlayer().setConsume(consume);
    mpd.getPlayer().setSingle(single);

    return Optional.empty();
  }

  private Optional<Message> addDir(Object pPayload) {
    HashMap<String, String> payload = (HashMap<String, String>) pPayload;
    String path = payload.get("dir");
    MPDFile mpdFile = new MPDFile(path);
    mpd.getPlaylist().addFileOrDirectory(mpdFile);
    return Optional.empty();
  }

  private Optional<Message> browse(Object pPayload) {
    /* Map and extract payload */
    HashMap<String, String> payload = (HashMap<String, String>) pPayload;
    String path = payload.get("path");

    /* Remove leading slashes */
    path = path.replaceAll("^/+", "");

    /* Outgoing payload */
    BrowsePayload browsePayload = browseDir(path);

    if (path.trim().length() < 2) {
      /* '/' or '' */
      browsePayload.getPlaylists().addAll(getPlaylists());
    }

    BrowseMessage browseMessage = new BrowseMessage();
    browseMessage.setPayload(browsePayload);
    return Optional.of(browseMessage);
  }

  private Collection<Playlist> getPlaylists() {
    TreeSet<Playlist> ret = new TreeSet<>();
    Collection<String> playlists = mpd.getMusicDatabase().getPlaylistDatabase().listPlaylists();

    for (String playlist : playlists) {
      int count = mpd.getMusicDatabase().getPlaylistDatabase().countPlaylistSongs(playlist);
      ret.add(new Playlist(playlist, count));
    }

    return ret;
  }

  private BrowsePayload browseDir(String path) {
    BrowsePayload browsePayload = new BrowsePayload();
    MPDFile mpdFile = new MPDFile(path);
    mpdFile.setDirectory(true);
    Collection<MPDFile> tmpMpdFiles = new ArrayList<>();

    try {
      tmpMpdFiles = mpd.getMusicDatabase().getFileDatabase().listDirectory(mpdFile);
    } catch (Exception e) {
      LOG.error("Error listing directory '" + path + "'");
      LOG.error(e.getMessage(), e);
    }

    for (MPDFile file : tmpMpdFiles) {
      if (file.isDirectory()) {
        browsePayload.getDirectories().add(file);
      } else {
        Collection<MPDSong> searchResults =
            mpd.getMusicDatabase().getSongDatabase().searchFileName(file.getPath());
        if (searchResults.size() > 0) {
          browsePayload.getSongs().add(searchResults.iterator().next());
        }
      }
    }
    return browsePayload;
  }

  private Optional<Message> getQueue(Object pPayload) {
    Queue q = new Queue();
    q.setPayload(mpd.getPlaylist().getSongList());
    return Optional.of(q);

  }

  private Optional<Message> setVolume(Object pVolume) {
    try {
      HashMap<String, Integer> volumePayload = (HashMap<String, Integer>) pVolume;
      int newVolumeValue = volumePayload.get("value");
      mpd.getPlayer().setVolume(newVolumeValue);
    } catch (Exception e) {
      LOG.error(e.getMessage(), e);
    }
    return Optional.empty();
  }

  private Optional<Message> playTrack(Object pPayload) {
    HashMap<String, String> payload = (HashMap<String, String>) pPayload;
    String path = payload.get("path");
    List<MPDSong> songList = mpd.getPlaylist().getSongList();
    Collection<MPDSong> mpdSongCollection =
        mpd.getMusicDatabase().getSongDatabase().searchFileName(path);

    List<MPDSong> result =
        songList.stream().filter(n -> mpdSongCollection.contains(n)).collect(Collectors.toList());

    if (result.size() > 0) {
      mpd.getPlayer().playSong(result.iterator().next());
    } else {
      LOG.error("Track not found: " + path);
    }

    return Optional.empty();
  }

  private Optional<Message> removeTrack(Object pPayload) {
    HashMap<String, Integer> payload = (HashMap<String, Integer>) pPayload;
    int position = payload.get("position");
    mpd.getPlaylist().removeSong(position);
    return Optional.empty();
  }

  private Optional<Message> removeAll(Object o) {
    mpd.getPlaylist().clearPlaylist();
    return Optional.empty();
  }
}
