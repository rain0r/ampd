import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { BehaviorSubject, Observable } from "rxjs";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { MpdAlbum } from "src/app/shared/models/http/album";
import { AlbumModalComponent } from "../album-modal/album-modal.component";

@Component({
  selector: "app-album-item",
  templateUrl: "./album-item.component.html",
  styleUrls: ["./album-item.component.scss"],
})
export class AlbumItemComponent implements OnInit {
  @Input() album: MpdAlbum | null = null;
  coverSizeClass: Observable<string>;
  private isMobile = new Observable<boolean>();
  private albumModalOpen = new BehaviorSubject(false);

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private responsiveScreenService: ResponsiveScreenService
  ) {
    this.coverSizeClass = this.responsiveScreenService.getCoverCssClass();
    this.isMobile = this.responsiveScreenService.isMobile();
  }

  ngOnInit(): void {
    this.updateCover();
  }

  openModal(): void {
    if (!this.albumModalOpen.value) {
      this.albumModalOpen.next(true);
      const width = this.isMobile ? "100%" : "70%";
      const options: MatDialogConfig = {
        maxWidth: "100vw",
        width: width,
        data: this.album,
      };
      if (this.isMobile) {
        options["height"] = "100%";
        options["maxHeight"] = "100vh";
      }
      const dialogRef = this.dialog.open(AlbumModalComponent, options);
      dialogRef.afterClosed().subscribe(() => this.albumModalOpen.next(false));
    }
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
            this.album.albumCoverUrl = "assets/transparent.png";
          }
        },
      });
  }
}
