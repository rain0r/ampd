import { ConnectionConfig } from "../../connection-config/connection-config";

export interface IDirectory {
  directory: boolean;
  path: string;
  lastModified?: Date;
}

export class Directory implements IDirectory {
  directory: boolean;
  path: string;

  constructor(directory: boolean, path: string) {
    this.directory = directory;
    this.path = path;
  }

  displayedPath(): string {
    return this.path.trim().split("/").pop() || "";
  }

  coverUrl() {
    const cc = ConnectionConfig.get();
    const currentCoverUrl = "find-cover";
    // Add a query param to trigger an image change in the browser
    return `${cc.backendAddr}/${currentCoverUrl}?path=${encodeURIComponent(
      this.path
    )}`;
  }
}
