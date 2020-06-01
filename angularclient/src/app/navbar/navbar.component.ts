import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/index";
import {ThemingService} from "../shared/services/theming.service";
import {RxStompService} from "@stomp/ng2-stompjs";
import {RxStompState} from "@stomp/rx-stomp";
import {map} from "rxjs/internal/operators";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isDarkTheme: Observable<boolean>;
  connectedStatusIcon = "cloud_off";
  connState: Observable<string>;

  constructor(private themingService: ThemingService,private rxStompService: RxStompService) {
    this.isDarkTheme = this.themingService.isDarkTheme;
    this.connState = this.rxStompService.connectionState$.pipe(map((state) => {
      // convert numeric RxStompState to string
      return RxStompState[state];
    }));
  }

  ngOnInit(): void {
  }

  toggleDarkTheme(checked: boolean): void {
    this.themingService.setDarkTheme(checked);
  }
}
