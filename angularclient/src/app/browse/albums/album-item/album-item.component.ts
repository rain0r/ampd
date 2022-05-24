import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MpdAlbum } from "src/app/shared/models/http/album";
import { FrontendSettingsService } from "src/app/shared/services/frontend-settings.service";
import { ResponsiveScreenService } from "src/app/shared/services/responsive-screen.service";
import { AlbumModalComponent } from "../album-modal/album-modal.component";

@Component({
  selector: "app-album-item",
  templateUrl: "./album-item.component.html",
  styleUrls: ["./album-item.component.scss"],
})
export class AlbumItemComponent implements OnInit {
  @Input() album: MpdAlbum | null = null;
  coverSizeClass: Observable<string>;
  isMobile = false;
  private albumModalOpen = new BehaviorSubject(false);

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private responsiveCoverSizeService: ResponsiveScreenService,
    private http: HttpClient,
    private frontendSettingsService: FrontendSettingsService
  ) {
    this.coverSizeClass = this.responsiveCoverSizeService.getCoverCssClass();
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .pipe(map((state: BreakpointState) => state.matches))
      .subscribe((isMobile) => (this.isMobile = isMobile));
    this.updateCover();
  }

  openModal(): void {
    if (!this.albumModalOpen.value) {
      this.albumModalOpen.next(true);
      const width = this.isMobile ? "100%" : "70%";
      const options: MatDialogConfig = {
        maxWidth: "100vw",
        panelClass: this.frontendSettingsService.darkTheme$.value
          ? "dark-theme"
          : "",
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
