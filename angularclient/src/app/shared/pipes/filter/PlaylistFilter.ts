import { Pipe, PipeTransform } from "@angular/core";
import { PlaylistImpl } from "../../messages/incoming/playlist-impl";

@Pipe({ name: "playlistFilter" })
export class PlaylistFilterPipe implements PipeTransform {
  transform(value: PlaylistImpl[], filterBy: string): PlaylistImpl[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : "";
    return filterBy
      ? value.filter(
          (pl: PlaylistImpl) =>
            pl.name.toLocaleLowerCase().indexOf(filterBy) !== -1
        )
      : value;
  }
}
