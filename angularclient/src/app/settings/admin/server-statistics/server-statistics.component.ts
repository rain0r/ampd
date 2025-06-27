import { Component, inject } from "@angular/core";
import { Observable } from "rxjs";
import { MpdService } from "../../../service/mpd.service";
import { ServerStatistics } from "../../../shared/model/server-statistics";
import { NgIf, AsyncPipe, DatePipe } from "@angular/common";
import { MatCard, MatCardContent } from "@angular/material/card";
import { SecondsToHhMmSsPipe } from "../../../shared/pipes/seconds-to-hh-mm-ss.pipe";

@Component({
  selector: "app-server-statistics",
  templateUrl: "./server-statistics.component.html",
  styleUrls: ["./server-statistics.component.scss"],
  imports: [
    NgIf,
    MatCard,
    MatCardContent,
    AsyncPipe,
    DatePipe,
    SecondsToHhMmSsPipe,
  ],
})
export class ServerStatisticsComponent {
  private mpdService = inject(MpdService);

  serverStatistics: Observable<ServerStatistics>;

  constructor() {
    this.serverStatistics = this.mpdService.getServerStatistics$();
  }
}
