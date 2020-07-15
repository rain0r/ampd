export enum InternalMessageType {
  /**
   * Transports the keyword to filter when browsing directories.
   */
  BrowseFilter,
  /**
   * For manually blacklisting a cover. Usually, cover updates are triggered by the backend.
   */
  UpdateCover,
}
