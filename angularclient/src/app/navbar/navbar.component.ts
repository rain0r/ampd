import { Component } from "@angular/core";
import { Observable } from "rxjs/index";
import { ThemingService } from "../shared/services/theming.service";
import { RxStompService } from "@stomp/ng2-stompjs";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  isDarkTheme: Observable<boolean>;
  connState: Observable<number>;

  constructor(
    private themingService: ThemingService,
    private rxStompService: RxStompService
  ) {
    this.isDarkTheme = this.themingService.isDarkTheme;
    this.connState = rxStompService.connectionState$;
  }

  toggleDarkTheme(checked: boolean): void {
    this.themingService.setDarkTheme(checked);
  }
}
