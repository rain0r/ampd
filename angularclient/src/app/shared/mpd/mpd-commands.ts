/* Command target */
export const REMOTE_QUEUE = "/app/mpd";

export class MpdCommands {
  static readonly ADD_DIR = "ADD_DIR";
  static readonly ADD_PLAYLIST = "ADD_PLAYLIST";
  static readonly ADD_PLAY_TRACK = "ADD_PLAY_TRACK";
  static readonly ADD_TRACK = "ADD_TRACK";
  static readonly DELETE_PLAYLIST = "DELETE_PLAYLIST";
  static readonly GET_BROWSE = "GET_BROWSE";
  static readonly GET_QUEUE = "GET_QUEUE";
  static readonly PLAY_TRACK = "PLAY_TRACK";
  static readonly RM_ALL = "RM_ALL";
  static readonly RM_TRACK = "RM_TRACK";
  static readonly SAVE_PLAYLIST = "SAVE_PLAYLIST";
  static readonly SEARCH = "SEARCH";
  static readonly SET_NEXT = "SET_NEXT";
  static readonly SET_PAUSE = "SET_PAUSE";
  static readonly SET_PLAY = "SET_PLAY";
  static readonly SET_PREV = "SET_PREV";
  static readonly SET_SEEK = "SET_SEEK";
  static readonly SET_STOP = "SET_STOP";
  static readonly SET_VOLUME = "SET_VOLUME";
  static readonly TOGGLE_CONTROL = "TOGGLE_CONTROL";
}
