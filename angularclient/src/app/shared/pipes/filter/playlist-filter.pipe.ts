import { Pipe, PipeTransform } from "@angular/core";
import { Playlist } from "../../messages/incoming/playlist";

@Pipe({ name: "playlistFilter" })
export class PlaylistFilterPipe implements PipeTransform {
  transform(value: Playlist[], filterBy: string): Playlist[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : "";
    return filterBy
      ? value.filter(
          (pl: Playlist) =>
            pl.name.toLocaleLowerCase().indexOf(filterBy) !== -1,
        )
      : value;
  }
}
