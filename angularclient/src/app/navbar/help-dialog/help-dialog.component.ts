import { Component, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ShortcutService } from "src/app/service/shortcut.service";
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from "@angular/material/dialog";
import { CdkScrollable } from "@angular/cdk/scrolling";

import { MatButton } from "@angular/material/button";
import { FilterByCategoryPipe } from "../../shared/pipes/filter/filter-by-category.pipe";

@Component({
  selector: "app-help-dialog",
  templateUrl: "./help-dialog.component.html",
  styleUrls: ["./help-dialog.component.scss"],
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    FilterByCategoryPipe,
  ],
})
export class HelpDialogComponent {
  private shortcutService = inject(ShortcutService);

  isDarkTheme: Observable<boolean> = new Observable<boolean>();
  categories = this.shortcutService.categories();
  shortcuts = this.shortcutService.shortcuts;
}
