package org.hihn.ampd.server.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.TreeSet;
import java.util.stream.Collectors;
import org.bff.javampd.file.MpdFile;
import org.bff.javampd.server.Mpd;
import org.bff.javampd.song.MpdSong;
import org.bff.javampd.song.SongSearcher.ScopeType;
import org.hihn.ampd.server.config.AmpdCommandRunner;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.message.AmpdMessage.MessageType;
import org.hihn.ampd.server.message.Message;
import org.hihn.ampd.server.message.outgoing.browse.BrowseMessage;
import org.hihn.ampd.server.message.outgoing.browse.BrowsePayload;
import org.hihn.ampd.server.message.outgoing.browse.Directory;
import org.hihn.ampd.server.message.outgoing.browse.Playlist;
import org.hihn.ampd.server.message.outgoing.playlist.PlaylistSavedMessage;
import org.hihn.ampd.server.message.outgoing.playlist.PlaylistSavedPayload;
import org.hihn.ampd.server.message.outgoing.queue.QueueMessage;
import org.hihn.ampd.server.message.outgoing.queue.QueuePayload;
import org.hihn.ampd.server.message.outgoing.search.SearchMessage;
import org.hihn.ampd.server.message.outgoing.search.SearchPayload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class MpdService {

  private static final Logger LOG = LoggerFactory.getLogger(MpdService.class);
  private final EnumMap<MessageType, AmpdCommandRunner> commands =
      new EnumMap<>(MessageType.class);
  private final Mpd mpd;

  public MpdService(MpdConfiguration mpdConfiguration) {
    this.mpd = mpdConfiguration.mpd();
    this.buildCommandMap();
  }

  public Optional<Message> process(Message message) {
    LOG.debug("Processiong message: {}", message);
    return commands.get(message.getType()).run(message.getPayload());
  }

  private Optional<Message> addDir(Object inputPayload) {
    HashMap<String, String> payload = getStringStringHashMap(
        (HashMap<String, String>) inputPayload);
    String path = payload.get("dir");
    MpdFile mpdFile = new MpdFile(path);
    mpd.getPlaylist().addFileOrDirectory(mpdFile);
    return Optional.empty();
  }

  private Optional<Message> addPlayTrack(Object inputPayload) {
    addTrack(inputPayload);
    playTrack(inputPayload);
    return Optional.empty();
  }

  private Optional<Message> addPlaylist(Object inputPayload) {
    HashMap<String, String> payload = (HashMap<String, String>) inputPayload;
    String playlist = payload.get("playlist");
    ArrayList<MpdSong> mpdSongs = new ArrayList<>();
    Collection<MpdSong> mpdSongCollection =
        mpd.getMusicDatabase().getPlaylistDatabase().listPlaylistSongs(playlist);
    mpdSongs.addAll(mpdSongCollection);
    mpd.getPlaylist().addSongs(mpdSongs);
    return Optional.empty();
  }

  private Optional<Message> addTrack(Object inputPayload) {
    HashMap<String, String> payload = (HashMap<String, String>) inputPayload;
    String path = payload.get("path");
    MpdFile mpdFile = new MpdFile(path);
    mpdFile.setDirectory(false);
    mpd.getPlaylist().addFileOrDirectory(mpdFile);
    return Optional.empty();
  }

  /**
   * Sets the state of the control panel.
   *
   * @param incomingPayload The new control panel state.
   */
  private void applyControlPanelChanges(Object incomingPayload) {
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

  private Optional<Message> browse(Object inputPayload) {
    /* Map and extract payload */
    HashMap<String, String> payload = (HashMap<String, String>) inputPayload;
    String path = payload.get("path");

    /* Remove leading slashes */
    path = path.replaceAll("^/+", "");

    /* Outgoing payload */
    BrowsePayload browsePayload = browseDir(path);

    if (path.trim().length() < 2) {
      /* '/' or '' */
      browsePayload.addPlaylists(getPlaylists());
    }

    BrowseMessage browseMessage = new BrowseMessage(browsePayload);
    return Optional.of(browseMessage);
  }

  private BrowsePayload browseDir(String path) {
    BrowsePayload browsePayload = new BrowsePayload();
    MpdFile mpdFile = new MpdFile(path);
    mpdFile.setDirectory(true);
    Collection<MpdFile> tmpMpdFiles = new ArrayList<>();
    try {
      tmpMpdFiles = mpd.getMusicDatabase().getFileDatabase().listDirectory(mpdFile);
    } catch (Exception e) {
      LOG.error("Error listing directory '{}'", path);
      LOG.error(e.getMessage(), e);
    }
    for (MpdFile file : tmpMpdFiles) {
      if (file.isDirectory()) {
        Directory d = new Directory(file.getPath());
        browsePayload.addDirectory(d);
      } else {
        Collection<MpdSong> searchResults =
            mpd.getMusicDatabase().getSongDatabase().searchFileName(file.getPath());
        if (!searchResults.isEmpty()) {
          browsePayload.addTrack(searchResults.iterator().next());
        }
      }
    }
    return browsePayload;
  }

  private void buildCommandMap() {
    commands.put(MessageType.ADD_DIR, this::addDir);
    commands.put(MessageType.ADD_PLAYLIST, this::addPlaylist);
    commands.put(MessageType.ADD_PLAY_TRACK, this::addPlayTrack);
    commands.put(MessageType.ADD_TRACK, this::addTrack);
    commands.put(MessageType.DELETE_PLAYLIST, this::deletePlaylist);
    commands.put(MessageType.GET_BROWSE, this::browse);
    commands.put(MessageType.GET_QUEUE, this::getQueue);
    commands.put(MessageType.PLAY_TRACK, this::playTrack);
    commands.put(MessageType.RM_ALL, this::removeAll);
    commands.put(MessageType.RM_TRACK, this::removeTrack);
    commands.put(MessageType.SEARCH, this::search);
    commands.put(MessageType.SAVE_PLAYLIST, this::savePlaylist);
    commands.put(MessageType.SET_NEXT, this::playNext);
    commands.put(MessageType.SET_PAUSE, this::pause);
    commands.put(MessageType.SET_PLAY, this::play);
    commands.put(MessageType.SET_PREV, this::playPrevious);
    commands.put(MessageType.SET_SEEK, this::seek);
    commands.put(MessageType.SET_STOP, this::stop);
    commands.put(MessageType.SET_VOLUME, this::setVolume);
    commands.put(MessageType.TOGGLE_CONTROL, this::toggleControlPanel);
  }

  private Optional<Message> deletePlaylist(Object inputPayload) {
    HashMap<String, String> payload = (HashMap<String, String>) inputPayload;
    String playlistName = payload.get("playlistName");
    mpd.getPlaylist().deletePlaylist(playlistName);
    return Optional.empty();
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

  private Optional<Message> getQueue(Object inputPayload) {
    QueuePayload queuePayload = new QueuePayload(mpd.getPlaylist().getSongList());
    QueueMessage queue = new QueueMessage(queuePayload);
    return Optional.of(queue);
  }

  private HashMap<String, String> getStringStringHashMap(HashMap<String, String> inputPayload) {
    return inputPayload;
  }

  private Optional<Message> pause(Object o) {
    mpd.getPlayer().pause();
    return Optional.empty();
  }

  private Optional<Message> play(Object o) {
    mpd.getPlayer().play();
    return Optional.empty();
  }

  private Optional<Message> playNext(Object o) {
    mpd.getPlayer().playNext();
    return Optional.empty();
  }

  private Optional<Message> playPrevious(Object o) {
    mpd.getPlayer().playPrevious();
    return Optional.empty();
  }

  private Optional<Message> playTrack(Object inputPayload) {
    HashMap<String, String> payload = (HashMap<String, String>) inputPayload;
    String path = payload.get("path");
    List<MpdSong> trackList = mpd.getPlaylist().getSongList();
    Collection<MpdSong> mpdSongCollection =
        mpd.getMusicDatabase().getSongDatabase().searchFileName(path);

    List<MpdSong> result =
        trackList.stream().filter(n -> mpdSongCollection.contains(n)).collect(Collectors.toList());

    if (result.size() > 0) {
      mpd.getPlayer().playSong(result.iterator().next());
    } else {
      LOG.error("Track not found: " + path);
    }

    return Optional.empty();
  }

  private Optional<Message> removeAll(Object o) {
    mpd.getPlaylist().clearPlaylist();
    return Optional.empty();
  }

  private Optional<Message> removeTrack(Object inputPayload) {
    HashMap<String, Integer> payload = (HashMap<String, Integer>) inputPayload;
    int position = payload.get("position");
    mpd.getPlaylist().removeSong(position);
    return Optional.empty();
  }

  private Optional<Message> savePlaylist(Object inputPayload) {
    HashMap<String, String> payload = (HashMap<String, String>) inputPayload;
    String playlistName = payload.get("playlistName");
    boolean success;
    try {
      success = mpd.getPlaylist().savePlaylist(playlistName);
    } catch (Exception e) {
      success = false;
      LOG.error("Failed to create playlist: {}", playlistName);
      LOG.error(e.getMessage(), e);
    }
    PlaylistSavedPayload playlistSavedPayload = new PlaylistSavedPayload(playlistName, success);
    PlaylistSavedMessage playlistSavedMessage = new PlaylistSavedMessage(playlistSavedPayload);
    return Optional.of(playlistSavedMessage);
  }

  private Optional<Message> search(Object inputPayload) {
    HashMap<String, String> payload = (HashMap<String, String>) inputPayload;
    String query = payload.get("query");
    return Optional.of(searchDatabase(query));
  }

  /**
   * Takes a query and searches the Mpd database for it.
   *
   * @param query What to search for.
   * @return A message with the search results.
   */
  private SearchMessage searchDatabase(String query) {
    ArrayList<MpdSong> searchResults = new ArrayList<>();
    searchResults.addAll(mpd.getSongSearcher().search(ScopeType.ANY, query));

    SearchMessage searchResult =
        new SearchMessage(new SearchPayload(searchResults, searchResults.size(), query));
    return searchResult;
  }

  private Optional<Message> seek(Object inputPayload) {
    HashMap<String, Integer> payload = (HashMap<String, Integer>) inputPayload;
    int value = payload.get("value");
    mpd.getPlayer().seek(value);
    return Optional.empty();
  }

  private Optional<Message> setVolume(Object inputVolume) {
    try {
      HashMap<String, Integer> volumePayload = (HashMap<String, Integer>) inputVolume;
      int newVolumeValue = volumePayload.get("value");
      mpd.getPlayer().setVolume(newVolumeValue);
    } catch (Exception e) {
      LOG.error("Error setting volume: {}", e.getMessage(), e);
    }
    return Optional.empty();
  }

  private Optional<Message> stop(Object o) {
    mpd.getPlayer().stop();
    return Optional.empty();
  }

  private Optional<Message> toggleControlPanel(Object inputPayload) {
    applyControlPanelChanges(inputPayload);
    return Optional.empty();
  }
}
