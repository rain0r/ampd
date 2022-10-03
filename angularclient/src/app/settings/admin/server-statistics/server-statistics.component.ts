import { Component } from "@angular/core";
import { ServerStatistics } from "../../../shared/model/server-statistics";
import { Observable } from "rxjs";
import { MpdService } from "../../../service/mpd.service";

@Component({
  selector: "app-server-statistics",
  templateUrl: "./server-statistics.component.html",
  styleUrls: ["./server-statistics.component.scss"],
})
export class ServerStatisticsComponent {
  serverStatistics: Observable<ServerStatistics>;

  constructor(private mpdService: MpdService) {
    this.serverStatistics = this.mpdService.getServerStatistics();
  }
}
