import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor() {
    // this.innerWidth = window.innerWidth;
  }

  // @HostListener("window:resize", ["$event"])
  // onResize(): void {
  //   this.innerWidth = window.innerWidth;
  // }
  //
  // isMobile(): boolean {
  //   return this.innerWidth <= 600;
  // }
}
