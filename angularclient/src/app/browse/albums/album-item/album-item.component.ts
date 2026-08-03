import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, first } from "rxjs";
import { MpdAlbum } from "../../../shared/model/http/album";
import { AlbumDialogComponent } from "../album-dialog/album-dialog.component";

@Component({
  selector: "app-album-item",
  templateUrl: "./album-item.component.html",
  styleUrls: ["./album-item.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class AlbumItemComponent implements OnInit {
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private http = inject(HttpClient);
  private changeDetectorRef = inject(ChangeDetectorRef);

  @Input() album: MpdAlbum | null = null;
  private albumDialogOpen = new BehaviorSubject(false);

  ngOnInit(): void {
    this.updateCover();
  }

  openDialog(): void {
    this.albumDialogOpen
      .asObservable()
      .pipe(first(), takeUntilDestroyed(this.destroyRef))
      .subscribe((open) => {
        if (!open) {
          this.albumDialogOpen.next(true);
          const dialogRef = this.dialog.open(AlbumDialogComponent, {
            data: this.album,
            height: "80%",
            width: "80%",
          });
          dialogRef
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          if (this.album) {
            this.album.albumCoverUrl = "assets/images/no-cover.svg";
            this.changeDetectorRef.detectChanges();
          }
        },
      });
  }
}
