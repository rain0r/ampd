import { Component, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/index";
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
  isDarkTheme: Observable<boolean>;

  constructor(private router: Router, private themingService: ThemingService) {
    this.innerWidth = window.innerWidth;
    this.buildConnectionState();
    this.isDarkTheme = this.themingService.isDarkTheme;
  }

  @HostListener("window:resize", ["$event"])
  onResize(): void {
    this.innerWidth = window.innerWidth;
  }

  toggleDarkTheme(checked: boolean): void {
    this.themingService.setDarkTheme(checked);
  }

  setConnected(): void {
    this.connectedStatusIcon = "cloud";
  }

  setDisconnected(): void {
    this.connectedStatusIcon = "cloud_off";
  }

  isMobile(): boolean {
    return this.innerWidth <= 600;
  }

  private buildConnectionState(): void {
    // TODO
    // this.stompService.state
    //   .pipe(filter((state: number) => state === StompState.CLOSED))
    //   .subscribe(() => {
    //     this.setDisconnected();
    //   });
    //
    // this.stompService.state
    //   .pipe(filter((state: number) => state === StompState.CONNECTED))
    //   .subscribe(() => {
    //     this.setConnected();
    //   });
  }
}
