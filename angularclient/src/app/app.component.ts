import { Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { StompService, StompState } from "@stomp/ng2-stompjs";
import { Observable } from "rxjs/index";
import { filter } from "rxjs/internal/operators";
import { ThemingService } from "./shared/services/theming.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "app";
  connectedStatusIcon = "cloud_off";
  innerWidth: number;

  @ViewChild("inputSearch") inputSearch?: ElementRef;
  isDarkTheme: Observable<boolean>;

  constructor(
    private router: Router,
    private stompService: StompService,
    private themingService: ThemingService
  ) {
    this.innerWidth = window.innerWidth;
    this.buildConnectionState();
    this.isDarkTheme = this.themingService.isDarkTheme;
  }

  toggleDarkTheme(checked: boolean) {
    this.themingService.setDarkTheme(checked);
  }

  setConnected() {
    this.connectedStatusIcon = "cloud";
  }

  setDisconnected() {
    this.connectedStatusIcon = "cloud_off";
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyDown(event: KeyboardEvent) {
    if (event.which === 13) {
      if (this.inputSearch) {
        const query: string = this.inputSearch.nativeElement.value;
        if (query.trim().length > 0) {
          this.router.navigate(["search"], { queryParams: { query } });
        }
      }
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  isMobile(): boolean {
    return this.innerWidth <= 600;
  }

  private buildConnectionState(): void {
    this.stompService.state
      .pipe(filter((state: number) => state === StompState.CLOSED))
      .subscribe(() => {
        this.setDisconnected();
      });

    this.stompService.state
      .pipe(filter((state: number) => state === StompState.CONNECTED))
      .subscribe(() => {
        this.setConnected();
      });
  }
}
