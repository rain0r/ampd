import { Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { Observable } from "rxjs";
import { AmpdRxStompService } from "./../service/ampd-rx-stomp.service";
import { ShortcutService } from "./../service/shortcut.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  @ViewChild("helpIcon") helpIcon: ElementRef = {} as ElementRef;

  connState: Observable<number>;

  constructor(
    private rxStompService: AmpdRxStompService,
    private shortcutService: ShortcutService,
  ) {
    this.connState = this.rxStompService.connectionState$;
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
}
