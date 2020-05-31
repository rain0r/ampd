import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { StompService } from "@stomp/ng2-stompjs";
import { environment } from "../../environments/environment";
import { ConnectionConfigUtil } from "../shared/connection-config/connection-config-util";
import { ConnectionConfig } from "../shared/connection-config/connection-config";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  ccModel: ConnectionConfig;
  ampdVersion;
  gitCommitId;
  private submitted = false;

  constructor(
    private snackBar: MatSnackBar,
    private stompService: StompService
  ) {
    this.ccModel = ConnectionConfigUtil.get();
    this.ampdVersion = environment.ampdVersion;
    this.gitCommitId = environment.gitCommitId;
  }

  onSubmit(): void {
    this.submitted = true;
  }

  saveSettings(): void {
    this.popUp("Saved settings.");
    const data = JSON.stringify(this.ccModel);
    localStorage.setItem(ConnectionConfigUtil.key, data);
    this.stompService.initAndConnect();
  }

  private popUp(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 2000,
    });
  }
}
