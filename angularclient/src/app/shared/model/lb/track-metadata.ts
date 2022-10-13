import { AdditionalInfo } from "./additional-info";
import { MbidMapping } from "./mbid-mapping";

export interface TrackMetadata {
  additionalInfo: AdditionalInfo;
  artistName: string;
  mbidMapping: MbidMapping;
  trackName: string;
  releaseName: string;
}
