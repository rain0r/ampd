package org.hihn.ampd.server.message;

public abstract class AmpdMessage implements Message {

  public enum MESSAGE_TYPE {
    /* Incoming */
    ADD_DIR,
    ADD_PLAYLIST,
    ADD_PLAY_TRACK,
    ADD_TRACK,
    GET_BROWSE,
    GET_QUEUE,
    PLAY_TRACK,
    RM_ALL,
    RM_TRACK,
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
    QUEUE,
    SEARCH_RESULTS,
    STATE,
  }
}
