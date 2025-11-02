/**
 * Corresponds to the settings of the MPD server in the backend.
 */
export interface MpdSettings {
  musicDirectory: string;
  mpdServer: string;
  mpdPort: number;
  localCoverCache: boolean;
  mbCoverService: boolean;
  resetModesOnClear: boolean;
  createNewPlaylists: boolean;
  deleteExistingPlaylists: boolean;
  version: string;
}
