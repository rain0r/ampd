export interface IServerStatus {
  audio: string;
  playlistVersion: number;
  bitrate: number;
  volume: number;
  repeat: boolean;
  random: boolean;
  xfade: number;
  elapsedTime: number;
  totalTime: number;
  databaseUpdating: boolean;
  consume: boolean;
  single: boolean;
  status: string[];
  error: string;
  state: string;
}

export class ServerStatus implements IServerStatus {
  public audio: string;
  public playlistVersion: number;
  public bitrate: number;
  public volume: number;
  public repeat: boolean;
  public random: boolean;
  public xfade: number;
  public elapsedTime: number;
  public totalTime: number;
  public databaseUpdating: boolean;
  public consume: boolean;
  public single: boolean;
  public status: string[];
  public error: string;
  public state: string;

  constructor(
    audio: string,
    playlistVersion: number,
    bitrate: number,
    volume: number,
    repeat: boolean,
    random: boolean,
    xfade: number,
    elapsedTime: number,
    totalTime: number,
    databaseUpdating: boolean,
    consume: boolean,
    single: boolean,
    status: string[],
    error: string,
    state: string
  ) {
    this.audio = audio;
    this.playlistVersion = playlistVersion;
    this.bitrate = bitrate;
    this.volume = volume;
    this.repeat = repeat;
    this.random = random;
    this.xfade = xfade;
    this.elapsedTime = elapsedTime;
    this.totalTime = totalTime;
    this.databaseUpdating = databaseUpdating;
    this.consume = consume;
    this.single = single;
    this.status = status;
    this.error = error;
    this.state = state;
  }
}
