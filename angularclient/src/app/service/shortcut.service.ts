import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { BehaviorSubject, first } from "rxjs";
import { HelpDialogComponent } from "../navbar/help-dialog/help-dialog.component";
import { Category } from "../shared/shortcuts/shortcut";
import { ShortCut } from "./../shared/shortcuts/shortcut";
import { ControlPanelService } from "./control-panel.service";
import { MpdModeService } from "./mpd-mode.service";
import { MpdService } from "./mpd.service";
import { QueueService } from "./queue.service";
import { VolumeService } from "./volume.service";

/* eslint-disable @typescript-eslint/unbound-method */

@Injectable({
  providedIn: "root",
})
export class ShortcutService {
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
      ["<", "ArrowLeft"]
    ),
    this.build(
      Category.PlayerControls,
      () => this.controlPanelService.next(),
      "Next song",
      [">", "ArrowRight"]
    ),
    this.build(
      Category.PlayerControls,
      () => this.controlPanelService.stop(),
      "Stop",
      ["s"]
    ),
    this.build(
      Category.PlayerControls,
      () => this.volumeService.decreaseVolume(),
      "Decrease volume",
      ["-"]
    ),
    this.build(
      Category.PlayerControls,
      () => this.volumeService.increaseVolume(),
      "Increase volume",
      ["+"]
    ),
    // Navigation
    this.build(
      Category.Navigation,
      () => void this.router.navigate(["/"]),
      "Queue view",
      ["1"]
    ),
    this.build(
      Category.Navigation,
      () => void this.router.navigate(["/browse"]),
      "Browse view",
      ["2"]
    ),
    this.build(
      Category.Navigation,
      () => void this.router.navigate(["/search"]),
      "Search view",
      ["3", "S"]
    ),
    this.build(
      Category.Navigation,
      () => void this.router.navigate(["/settings"]),
      "Settings view",
      ["4"]
    ),
    this.build(
      Category.General,
      () => void this.router.navigate(["/browse/radio-streams"]),
      "Navigate to radio streams",
      ["W"]
    ),
    // MPD modes
    this.build(
      Category.Modes,
      () => this.mpdModeService.toggleCtrlFromInput("repeat"),
      "Toggle repeat",
      ["r"]
    ),
    this.build(
      Category.Modes,
      () => this.mpdModeService.toggleCtrlFromInput("random"),
      "Toggle shuffle",
      ["z"]
    ),
    this.build(
      Category.Modes,
      () => this.mpdModeService.toggleCtrlFromInput("single"),
      "Toggle single",
      ["y"]
    ),
    this.build(
      Category.Modes,
      () => this.mpdModeService.toggleCtrlFromInput("consume"),
      "Toggle consume",
      ["R"]
    ),
    this.build(
      Category.Modes,
      () => this.mpdModeService.toggleCtrlFromInput("crossfade"),
      "Toggle crossfade",
      ["x"]
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
      ["C"]
    ),
  ];

  private currentState = "stop";
  private helpDialogOpen = new BehaviorSubject(false);

  constructor(
    private controlPanelService: ControlPanelService,
    private dialog: MatDialog,
    private mpdModeService: MpdModeService,
    private mpdService: MpdService,
    private queueService: QueueService,
    private router: Router,
    private volumeService: VolumeService
  ) {
    this.mpdService.currentState$.subscribe(
      (state) => (this.currentState = state)
    );
  }

  build(
    category: Category,
    action: (this: ShortcutService) => void,
    helpText: string,
    trigger: string[]
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
      this.shortcuts.map((shortcut) => Category[shortcut.category])
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
          const dialogRef = this.dialog.open(HelpDialogComponent, {
            autoFocus: true,
            height: "90%",
            width: "75%",
          });
          dialogRef
            .afterClosed()
            .subscribe(() => this.helpDialogOpen.next(false));
        }
      });
  }
}
