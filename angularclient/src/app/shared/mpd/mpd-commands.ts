/* Command target */
export const REMOTE_QUEUE = '/app/mpd';

export class MpdCommands {
  public static readonly ADD_DIR = 'ADD_DIR';
  public static readonly ADD_PLAYLIST = 'ADD_PLAYLIST';
  public static readonly ADD_PLAY_TRACK = 'ADD_PLAY_TRACK';
  public static readonly ADD_TRACK = 'ADD_TRACK';
  public static readonly GET_BROWSE = 'GET_BROWSE';
  public static readonly GET_QUEUE = 'GET_QUEUE';
  public static readonly PLAY_TRACK = 'PLAY_TRACK';
  public static readonly RM_ALL = 'RM_ALL';
  public static readonly RM_TRACK = 'RM_TRACK';
  public static readonly SEARCH = 'SEARCH';
  public static readonly SET_NEXT = 'SET_NEXT';
  public static readonly SET_PAUSE = 'SET_PAUSE';
  public static readonly SET_PLAY = 'SET_PLAY';
  public static readonly SET_PREV = 'SET_PREV';
  public static readonly SET_SEEK = 'SET_SEEK';
  public static readonly SET_STOP = 'SET_STOP';
  public static readonly SET_VOLUME = 'SET_VOLUME';
  public static readonly TOGGLE_CONTROL = 'TOGGLE_CONTROL';
}
