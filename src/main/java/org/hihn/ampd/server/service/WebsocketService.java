package org.hihn.ampd.server.service;

import java.util.Map;
import java.util.Optional;
import org.hihn.ampd.server.message.Message;

/**
 * Defines all methods that are avaiable via websocket commands.
 */
public interface WebsocketService {

  Optional<Message> addDir(Map<String, Object> inputPayload);

  Optional<Message> addPlayTrack(Map<String, Object> inputPayload);

  Optional<Message> addPlaylist(Map<String, Object> inputPayload);

  Optional<Message> addTrack(Map<String, Object> inputPayload);

  Optional<Message> blacklistCover(Map<String, Object> inputPayload);

  Optional<Message> browse(Map<String, Object> inputPayload);

  Optional<Message> deletePlaylist(Map<String, Object> inputPayload);

  Optional<Message> getQueue(Map<String, Object> inputPayload);

  Optional<Message> pause(Map<String, Object> inputPayload);

  Optional<Message> play(Map<String, Object> inputPayload);

  Optional<Message> playNext(Map<String, Object> inputPayload);

  Optional<Message> playPrevious(Map<String, Object> inputPayload);

  Optional<Message> playTrack(Map<String, Object> inputPayload);

  Optional<Message> removeAll(Map<String, Object> inputPayload);

  Optional<Message> removeTrack(Map<String, Object> inputPayload);

  Optional<Message> savePlaylist(Map<String, Object> inputPayload);

  Optional<Message> search(Map<String, Object> inputPayload);

  Optional<Message> seek(Map<String, Object> inputPayload);

  Optional<Message> setVolume(Map<String, Object> inputPayload);

  Optional<Message> stop(Map<String, Object> inputPayload);

  Optional<Message> toggleControlPanel(Map<String, Object> inputPayload);
}
