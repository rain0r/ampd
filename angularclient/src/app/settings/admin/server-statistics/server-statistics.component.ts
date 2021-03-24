import { Component } from "@angular/core";
import { SettingsService } from "../../../shared/services/settings.service";
import { ServerStatistics } from "../../../shared/models/server-statistics";
import { Observable } from "rxjs";

@Component({
  selector: "app-server-statistics",
  templateUrl: "./server-statistics.component.html",
  styleUrls: ["./server-statistics.component.scss"],
})
export class ServerStatisticsComponent {
  serverStatistics: Observable<ServerStatistics>;

  constructor(private settingsService: SettingsService) {
    this.serverStatistics = this.settingsService.getServerStatistics();
  }
}
