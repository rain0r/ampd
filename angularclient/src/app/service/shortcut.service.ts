import { Injectable, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { BehaviorSubject, first } from "rxjs";
import { HelpDialogComponent } from "../navbar/help-dialog/help-dialog.component";
import { AddStreamDialogComponent } from "../queue/track-table/add-stream-dialog/add-stream-dialog.component";
import { Category } from "../shared/shortcuts/shortcut";
import { ShortCut } from "./../shared/shortcuts/shortcut";
import { ControlPanelService } from "./control-panel.service";
import { MpdModeService } from "./mpd-mode.service";
import { MpdService } from "./mpd.service";
import { QueueService } from "./queue.service";
import { VolumeService } from "./volume.service";

@Injectable({
  providedIn: "root",
})
export class ShortcutService {
  private controlPanelService = inject(ControlPanelService);
  private dialog = inject(MatDialog);
  private mpdModeService = inject(MpdModeService);
  private mpdService = inject(MpdService);
  private queueService = inject(QueueService);
  private router = inject(Router);
  private volumeService = inject(VolumeService);

  // Player controls
  shortcuts: ShortCut[] = [
    this.build(Category.PlayerControls, this.togglePause, "Play / pause", [
      "p",
      " ",
    ]),
    this.build(
      Category.PlayerControls,
      () => this.controlPanelService.prev(),
      "Previous song",
      ["<", "ArrowLeft"],
    ),
    this.build(
      Category.PlayerControls,
      () => this.controlPanelService.next(),
      "Next song",
      [">", "ArrowRight"],
    ),
    this.build(
      Category.PlayerControls,
      () => this.controlPanelService.stop(),
      "Stop",
      ["s"],
    ),
    this.build(
      Category.PlayerControls,
      () => this.volumeService.decreaseVolume(),
      "Decrease volume",
      ["-"],
    ),
    this.build(
      Category.PlayerControls,
      () => this.volumeService.increaseVolume(),
      "Increase volume",
      ["+"],
    ),
    // Navigation
    this.build(
      Category.Navigation,
      () => void this.router.navigate(["/"]),
      "Queue",
      ["1"],
    ),
    this.build(
      Category.Navigation,
      () => void this.router.navigate(["/browse"]),
      "Browse",
      ["2"],
    ),
    this.build(
      Category.Navigation,
      () => void this.router.navigate(["/search"]),
      "Search",
      ["3", "S"],
    ),
    this.build(
      Category.Navigation,
      () => void this.router.navigate(["/settings"]),
      "Settings",
      ["4"],
    ),
    this.build(
      Category.Navigation,
      () => void this.router.navigate(["/browse-albums"]),
      "Albums",
      ["A"],
    ),
    this.build(
      Category.Navigation,
      () => void this.router.navigate(["/browse/genres"]),
      "Genres",
      ["G"],
    ),
    this.build(
      Category.Navigation,
      () => void this.router.navigate(["/browse-radio-streams"]),
      "Radio streams",
      ["u"],
    ),
    this.build(
      Category.Navigation,
      () => void this.router.navigate(["/adv-search"]),
      "Advanced Search",
      ["v"],
    ),
    // MPD modes
    this.build(
      Category.Modes,
      () => this.mpdModeService.toggleCtrlFromInput("repeat"),
      "Toggle repeat",
      ["r"],
    ),
    this.build(
      Category.Modes,
      () => this.mpdModeService.toggleCtrlFromInput("random"),
      "Toggle shuffle",
      ["z"],
    ),
    this.build(
      Category.Modes,
      () => this.mpdModeService.toggleCtrlFromInput("single"),
      "Toggle single",
      ["y"],
    ),
    this.build(
      Category.Modes,
      () => this.mpdModeService.toggleCtrlFromInput("consume"),
      "Toggle consume",
      ["R"],
    ),
    this.build(
      Category.Modes,
      () => this.mpdModeService.toggleCtrlFromInput("crossfade"),
      "Toggle crossfade",
      ["x"],
    ),
    // General
    this.build(Category.General, this.openHelpDialog, "Open search dialog", [
      "h",
      "?",
    ]),
    this.build(
      Category.General,
      () => this.queueService.clearQueue(),
      "Clear queue",
      ["C"],
    ),
    this.build(
      Category.General,
      this.openAddStreamDialog,
      "Open add stream dialog",
      ["a"],
    ),
  ];

  private currentState = "stop";
  private helpDialogOpen = new BehaviorSubject(false);
  private addStreamDialog = new BehaviorSubject(false);

  constructor() {
    this.mpdService.currentState$.subscribe(
      (state) => (this.currentState = state),
    );
  }

  build(
    category: Category,
    action: (this: ShortcutService) => void,
    helpText: string,
    trigger: string[],
  ): ShortCut {
    return {
      category: category,
      action: action,
      helpText: helpText,
      trigger: trigger,
    } as ShortCut;
  }

  listen(key: string): void {
    this.shortcuts
      .filter((shortcut) => shortcut.trigger.includes(key))
      .forEach((shortcut) => shortcut.action.call(this));
  }

  categories(): Set<string> {
    const ret = new Set(
      this.shortcuts.map((shortcut) => Category[shortcut.category]),
    );
    return ret;
  }

  private togglePause(): void {
    if (this.currentState === "pause" || this.currentState === "stop") {
      this.controlPanelService.play();
    } else if (this.currentState === "play") {
      this.controlPanelService.pause();
    }
  }

  private openHelpDialog(): void {
    this.helpDialogOpen
      .asObservable()
      .pipe(first())
      .subscribe((open) => {
        if (!open) {
          this.helpDialogOpen.next(true);
          const dialogRef = this.dialog.open(HelpDialogComponent);
          dialogRef
            .afterClosed()
            .subscribe(() => this.helpDialogOpen.next(false));
        }
      });
  }

  private openAddStreamDialog(): void {
    this.addStreamDialog
      .asObservable()
      .pipe(first())
      .subscribe((open) => {
        if (!open) {
          this.addStreamDialog.next(true);
          const dialogRef = this.dialog.open(AddStreamDialogComponent, {
            autoFocus: true,
            width: "50%",
          });
          dialogRef
            .afterClosed()
            .subscribe(() => this.addStreamDialog.next(false));
        }
      });
  }
}
