import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { StompService } from "@stomp/ng2-stompjs";
import { environment } from "../../environments/environment";
import { ConnConfUtil } from "../shared/conn-conf/conn-conf-util";
import { ConnConf } from "../shared/conn-conf/conn-conf";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  ccModel: ConnConf;
  ampdVersion;
  gitCommitId;
  private submitted = false;

  constructor(
    private snackBar: MatSnackBar,
    private stompService: StompService
  ) {
    this.ccModel = ConnConfUtil.get();
    this.ampdVersion = environment.ampdVersion;
    this.gitCommitId = environment.gitCommitId;
  }

  onSubmit(): void {
    this.submitted = true;
  }

  saveSettings(): void {
    this.popUp("Saved settings.");
    const data = JSON.stringify(this.ccModel);
    localStorage.setItem(ConnConfUtil.key, data);
    this.stompService.initAndConnect();
  }

  private popUp(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 2000,
    });
  }
}
