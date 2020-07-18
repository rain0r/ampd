package org.hihn.ampd.server.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import org.hihn.ampd.server.model.PlaylistInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class MpdService implements WebsocketService {

  private static final Logger LOG = LoggerFactory.getLogger(MpdService.class);

  /**
   * Maps all incoming websocket message types to a method.
   */
  private final EnumMap<MessageType, AmpdCommandRunner> commands = new EnumMap<>(MessageType.class);
  private final CoverBlacklistService coverBlacklistService;
  private final Mpd mpd;

  public MpdService(MpdConfiguration mpdConfiguration,
      CoverBlacklistService coverBlacklistService) {
    mpd = mpdConfiguration.mpd();
    this.coverBlacklistService = coverBlacklistService;
    buildCommandMap();
  }

  @Override
  public Optional<Message> addDir(Map<String, Object> inputPayload) {
    Map<String, String> payload = inputToStrMap(inputPayload);
    String path = payload.get("dir");
    MpdFile mpdFile = new MpdFile(path);
    mpd.getPlaylist().addFileOrDirectory(mpdFile);
    return Optional.empty();
  }

  @Override
  public Optional<Message> addPlayTrack(Map<String, Object> inputPayload) {
    addTrack(inputPayload);
    playTrack(inputPayload);
    return Optional.empty();
  }

  @Override
  public Optional<Message> addPlaylist(Map<String, Object> inputPayload) {
    Map<String, String> payload = inputToStrMap(inputPayload);
    String playlist = payload.get("playlist");
    Collection<MpdSong> mpdSongCollection =
        mpd.getMusicDatabase().getPlaylistDatabase().listPlaylistSongs(playlist);
    ArrayList<MpdSong> mpdSongs = new ArrayList<>(mpdSongCollection);
    mpd.getPlaylist().addSongs(mpdSongs);
    return Optional.empty();
  }

  @Override
  public Optional<Message> addTrack(Map<String, Object> inputPayload) {
    Map<String, String> payload = inputToStrMap(inputPayload);
    String path = payload.get("path");
    MpdFile mpdFile = new MpdFile(path);
    mpdFile.setDirectory(false);
    mpd.getPlaylist().addFileOrDirectory(mpdFile);
    return Optional.empty();
  }

  @Override
  public Optional<Message> blacklistCover(Map<String, Object> inputPayload) {
    Map<String, String> payload = inputToStrMap(inputPayload);
    String path = payload.get("file");
    coverBlacklistService.blacklistFile(path);
    return Optional.empty();
  }

  @Override
  public Optional<Message> browse(Map<String, Object> inputPayload) {
    Map<String, String> payload = inputToStrMap(inputPayload);
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

  @Override
  public Optional<Message> deletePlaylist(Map<String, Object> inputPayload) {
    Map<String, String> payload = inputToStrMap(inputPayload);
    String playlistName = payload.get("playlistName");
    mpd.getPlaylist().deletePlaylist(playlistName);
    return Optional.empty();
  }

  public Mpd getMpd() {
    return mpd;
  }

  /**
   * Gets info about a playlist from the MPD server.
   *
   * @param name The name of the playlist.
   * @return Info about the specified playlist.
   */
  public Optional<PlaylistInfo> getPlaylistInfo(String name) {
    Optional<PlaylistInfo> ret = Optional.empty();
    try {
      Collection<MpdSong> playlists = mpd.getMusicDatabase().getPlaylistDatabase()
          .listPlaylistSongs(name);
      int trackCount = mpd.getMusicDatabase().getPlaylistDatabase()
          .countPlaylistSongs(name);
      ret = Optional.of(new PlaylistInfo(name, trackCount, playlists));
    } catch (Exception e) {
      LOG.warn("Could not get info about playlist: {}", name);
    }
    return ret;
  }

  @Override
  public Optional<Message> getQueue(Map<String, Object> inputPayload) {
    QueuePayload queuePayload = new QueuePayload(mpd.getPlaylist().getSongList());
    QueueMessage queue = new QueueMessage(queuePayload);
    return Optional.of(queue);
  }

  @Override
  public Optional<Message> pause(Map<String, Object> inputPayload) {
    mpd.getPlayer().pause();
    return Optional.empty();
  }

  @Override
  public Optional<Message> play(Map<String, Object> inputPayload) {
    mpd.getPlayer().play();
    return Optional.empty();
  }

  @Override
  public Optional<Message> playNext(Map<String, Object> inputPayload) {
    mpd.getPlayer().playNext();
    return Optional.empty();
  }

  @Override
  public Optional<Message> playPrevious(Map<String, Object> inputPayload) {
    mpd.getPlayer().pause();
    return Optional.empty();
  }

  @Override
  public Optional<Message> playTrack(Map<String, Object> inputPayload) {
    Map<String, String> payload = inputToStrMap(inputPayload);
    String path = payload.get("path");
    List<MpdSong> trackList = mpd.getPlaylist().getSongList();
    Collection<MpdSong> mpdSongCollection =
        mpd.getMusicDatabase().getSongDatabase().searchFileName(path);
    List<MpdSong> result =
        trackList.stream().filter(mpdSongCollection::contains).collect(Collectors.toList());
    if (result.size() > 0) {
      mpd.getPlayer().playSong(result.iterator().next());
    } else {
      LOG.warn("Track not found: " + path);
    }
    return Optional.empty();
  }

  /**
   * Processes an incoming websocket message according to the commands map and returns the response
   * if there is one.
   *
   * @param message The incoming websocket message.
   * @return A websocket message that holds the response if there is one.
   */
  public Optional<Message> process(Message message) {
    LOG.debug("Processiong message: {}", message);
    return commands.get(message.getType()).run(message.getPayload());
  }

  @Override
  public Optional<Message> removeAll(Map<String, Object> inputPayload) {
    mpd.getPlaylist().clearPlaylist();
    return Optional.empty();
  }

  @Override
  public Optional<Message> removeTrack(Map<String, Object> inputPayload) {
    Map<String, Integer> payload = inputToIntMap(inputPayload);
    int position = payload.get("position");
    mpd.getPlaylist().removeSong(position);
    return Optional.empty();
  }

  @Override
  public Optional<Message> savePlaylist(Map<String, Object> inputPayload) {
    Map<String, String> payload = inputToStrMap(inputPayload);
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

  @Override
  public Optional<Message> search(Map<String, Object> inputPayload) {
    Map<String, String> payload = inputToStrMap(inputPayload);
    String query = payload.get("query");
    return Optional.of(searchDatabase(query));
  }

  @Override
  public Optional<Message> seek(Map<String, Object> inputPayload) {
    Map<String, Integer> payload = inputToIntMap(inputPayload);
    int value = payload.get("value");
    mpd.getPlayer().seek(value);
    return Optional.empty();
  }

  @Override
  public Optional<Message> setVolume(Map<String, Object> inputPayload) {
    try {
      Map<String, Integer> payload = inputToIntMap(inputPayload);
      int newVolumeValue = payload.get("value");
      mpd.getPlayer().setVolume(newVolumeValue);
    } catch (Exception e) {
      LOG.warn("Could not set volume: {}", e.getMessage(), e);
    }
    return Optional.empty();
  }

  @Override
  public Optional<Message> stop(Map<String, Object> inputPayload) {
    mpd.getPlayer().stop();
    return Optional.empty();
  }

  @Override
  public Optional<Message> toggleControlPanel(Map<String, Object> inputPayload) {
    // Map the input so we don't have to do ugly castings
    Map<String, HashMap<String, Boolean>> newMap = inputPayload.entrySet().stream()
        .collect(Collectors.toMap(Map.Entry::getKey, e -> (HashMap<String, Boolean>) e.getValue()));

    HashMap<String, Boolean> controlPanel = newMap.get("controlPanel");

    mpd.getPlayer().setRandom(controlPanel.get("random"));
    mpd.getPlayer().setRepeat(controlPanel.get("repeat"));
    mpd.getPlayer().setXFade(controlPanel.get("crossfade") ? 1 : 0);
    mpd.getPlayer().setConsume(controlPanel.get("consume"));
    mpd.getPlayer().setSingle(controlPanel.get("single"));
    return Optional.empty();
  }

  private BrowsePayload browseDir(String path) {
    BrowsePayload browsePayload = new BrowsePayload();
    // Build a MpdFile from path, this is a directory
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
    commands.put(MessageType.BLACKLIST_COVER, this::blacklistCover);
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

  private Collection<Playlist> getPlaylists() {
    TreeSet<Playlist> ret = new TreeSet<>();
    Collection<String> playlists = mpd.getMusicDatabase().getPlaylistDatabase()
        .listPlaylists();
    for (String playlist : playlists) {
      int count = mpd.getMusicDatabase().getPlaylistDatabase().countPlaylistSongs(playlist);
      ret.add(new Playlist(playlist, count));
    }
    return ret;
  }

  /**
   * Maps the incoming websocket message from <code>Map&lt;String, Object&gt;</code> to
   * <code>Map&lt;String, Integer&gt;</code>.
   *
   * @param map A map which values should be mapped to Boolean.
   * @return A map with typed values.
   */
  private Map<String, Integer> inputToIntMap(Map<String, Object> map) {
    return map.entrySet().stream()
        .collect(Collectors.toMap(Map.Entry::getKey, e -> (Integer) e.getValue()));
  }

  /**
   * Maps the incoming websocket message from <code>Map&lt;String, Object&gt;</code> to
   * <code>Map&lt;String, String&gt;</code>.
   *
   * @param map A map which values should be mapped to String.
   * @return A map with typed values.
   */
  private Map<String, String> inputToStrMap(Map<String, Object> map) {
    return map.entrySet().stream()
        .collect(Collectors.toMap(Map.Entry::getKey, e -> (String) e.getValue()));
  }

  /**
   * Takes a query and searches the Mpd database for it.
   *
   * @param query What to search for.
   * @return A message with the search results.
   */
  private SearchMessage searchDatabase(String query) {
    ArrayList<MpdSong> searchResults = new ArrayList<>(
        mpd.getSongSearcher().search(ScopeType.ANY, query));
    return new SearchMessage(new SearchPayload(searchResults, searchResults.size(), query));
  }
}
