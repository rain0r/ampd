import { ConnConfUtil } from "../../conn-conf/conn-conf-util";

export interface Directory {
  directory: boolean;
  path: string;
  lastModified?: Date;
}

export class DirectoryImpl implements Directory {
  directory: boolean;
  path: string;
  coverUrl: string;
  displayedPath: string;

  constructor(directory: boolean, path: string) {
    this.directory = directory;
    this.path = path;
    this.coverUrl = this.buildCoverUrl();
    this.displayedPath = this.buildDisplayedPath();
  }

  private buildDisplayedPath(): string {
    return this.path.trim().split("/").pop() || "";
  }

  private buildCoverUrl(): string {
    return `${ConnConfUtil.getFindDirCoverUrl()}?path=${encodeURIComponent(
      this.path
    )}`;
  }
}
