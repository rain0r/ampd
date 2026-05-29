import { AsyncPipe } from "@angular/common";
import { Component, HostListener, inject, OnInit } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatToolbar } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  Observable,
} from "rxjs";
import { ConnectingOverlayComponent } from "../connecting-overlay/connecting-overlay.component";
import { AmpdRxStompService } from "./../service/ampd-rx-stomp.service";
import { ShortcutService } from "./../service/shortcut.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  imports: [
    MatToolbar,
    MatButton,
    RouterLinkActive,
    RouterLink,
    MatIcon,
    MatProgressSpinner,
    RouterOutlet,
    AsyncPipe,
  ],
})
export class NavbarComponent implements OnInit {
  private rxStompService = inject(AmpdRxStompService);
  private shortcutService = inject(ShortcutService);
  readonly dialog = inject(MatDialog);
  private connDialogRef: MatDialogRef<
    ConnectingOverlayComponent,
    unknown
  > | null = null;
  private errorDialogOpen = new BehaviorSubject(false);

  connState: Observable<number>;

  constructor() {
    this.connState = this.rxStompService.connectionState$;
  }

  ngOnInit(): void {
    this.openConnectingDialog();
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyDown($event: KeyboardEvent): void {
    const inputElement = $event.target as HTMLInputElement;

    /* We ignore keys coming from input fields */
    if (
      inputElement.tagName === "MAT-SLIDER" ||
      inputElement.tagName === "INPUT"
    ) {
      return;
    }

    /* We don't want to interfere with non-ampd-shortcuts like Alt+Tab or Ctrl+R */
    if ($event.ctrlKey || $event.metaKey) {
      return;
    }

    /* We don't want to interfere with tab changes */
    if ($event.altKey) {
      return;
    }

    this.shortcutService.listen($event.key);
    $event.preventDefault();
  }

  openHelpDialog(): void {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "h" }));
  }

  private openConnectingDialog(): void {
    combineLatest([this.connState, this.errorDialogOpen])
      .pipe(distinctUntilChanged())
      .subscribe(([connState, errorDialogOpen]) => {
        if (!errorDialogOpen && connState !== 1) {
          console.log("connState:", connState);
          console.log("errorDialogOpen:", errorDialogOpen);
          this.connDialogRef = this.dialog.open(ConnectingOverlayComponent, {
            disableClose: true,
          });
          this.errorDialogOpen.next(true);
          this.connDialogRef
            .afterClosed()
            .subscribe(() => this.errorDialogOpen.next(false));
        } else if (connState === 1) {
          this.connDialogRef?.close();
        }
      });
  }
}
