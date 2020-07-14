package org.hihn.ampd.server.message;

/**
 * Base class of all messages exchanged between backend and frontend.
 */
public abstract class AmpdMessage implements Message {

  /**
   * Represents all available commands between the backend and the frontend.
   */
  public enum MessageType {
    /* Incoming */
    ADD_DIR,
    ADD_PLAYLIST,
    ADD_PLAY_TRACK,
    ADD_TRACK,
    BLACKLIST_COVER,
    DELETE_PLAYLIST,
    GET_BROWSE,
    GET_QUEUE,
    PLAY_TRACK,
    RM_ALL,
    RM_TRACK,
    SAVE_PLAYLIST,
    SEARCH,
    SET_NEXT,
    SET_PAUSE,
    SET_PLAY,
    SET_PREV,
    SET_SEEK,
    SET_STOP,
    SET_VOLUME,
    TOGGLE_CONTROL,

    /* Outgoing */
    BROWSE,
    PLAYLIST_SAVED,
    QUEUE,
    SEARCH_RESULTS,
    STATE,
  }
}
