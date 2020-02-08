import { Pipe, PipeTransform } from '@angular/core';
import { MpdTrack } from '../../messages/incoming/mpd-track';

@Pipe({ name: 'mpdTrackFilter' })
export class MpdTrackFilterPipe implements PipeTransform {
  public transform(value: MpdTrack[], filterBy: string): MpdTrack[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : '';
    return filterBy
      ? value.filter(
          (track: MpdTrack) =>
            track.title.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
            track.artistName.toLocaleLowerCase().indexOf(filterBy) !== -1
        )
      : value;
  }
}
