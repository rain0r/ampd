import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, first } from "rxjs";
import { MpdAlbum } from "src/app/shared/model/http/album";
import { AlbumDialogComponent } from "../album-dialog/album-dialog.component";

@Component({
  selector: "app-album-item",
  templateUrl: "./album-item.component.html",
  styleUrls: ["./album-item.component.scss"],
  imports: [],
})
export class AlbumItemComponent implements OnInit {
  private dialog = inject(MatDialog);
  private http = inject(HttpClient);

  @Input() album: MpdAlbum | null = null;
  private albumDialogOpen = new BehaviorSubject(false);

  ngOnInit(): void {
    this.updateCover();
  }

  openDialog(): void {
    this.albumDialogOpen
      .asObservable()
      .pipe(first())
      .subscribe((open) => {
        if (!open) {
          this.albumDialogOpen.next(true);
          const dialogRef = this.dialog.open(AlbumDialogComponent, {
            data: this.album,
            width: "80%",
          });
          dialogRef
            .afterClosed()
            .subscribe(() => this.albumDialogOpen.next(false));
        }
      });
  }

  private updateCover(): void {
    if (!this.album) {
      return;
    }
    this.http
      .head(this.album.albumCoverUrl, { observe: "response" })
      .subscribe({
        error: () => {
          if (this.album) {
            this.album.albumCoverUrl = "assets/images/no-cover.svg";
          }
        },
      });
  }
}
