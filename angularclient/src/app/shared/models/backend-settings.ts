/**
 * Corresponds to the settings of the MPD server in the backend.
 */
export interface BackendSettings {
  musicDirectory: string;
  mpdServer: string;
  mpdPort: number;
  mpdPassword: string;
  localCoverCache: boolean;
  mbCoverService: boolean;
  resetModesOnClear: boolean;
}
