import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { ShortcutService } from "src/app/service/shortcut.service";

@Component({
  selector: "app-help-dialog",
  templateUrl: "./help-dialog.component.html",
  styleUrls: ["./help-dialog.component.scss"],
})
export class HelpDialogComponent {
  isDarkTheme: Observable<boolean> = new Observable<boolean>();
  categories = this.shortcutService.categories();
  shortcuts = this.shortcutService.shortcuts;

  constructor(private shortcutService: ShortcutService) {}
}
