import { Component } from "@angular/core";
import { environment } from "../../environments/environment";
import { ConnConfUtil } from "../shared/conn-conf/conn-conf-util";
import { NotificationService } from "../shared/services/notification.service";
import { WebSocketService } from "../shared/services/web-socket.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { ThemingService } from "../shared/services/theming.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  ampdVersion: string;
  gitCommitId: string;
  isDarkTheme: Observable<boolean>;
  settingsForm: FormGroup;

  constructor(
    private notificationService: NotificationService,
    private webSocketService: WebSocketService,
    private formBuilder: FormBuilder,
    private themingService: ThemingService
  ) {
    const savedAddr = ConnConfUtil.getBackendAddr();
    this.ampdVersion = environment.ampdVersion;
    this.gitCommitId = environment.gitCommitId;
    this.isDarkTheme = this.themingService.isDarkTheme;

    this.settingsForm = this.formBuilder.group({
      backendAddr: [savedAddr, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) {
      this.notificationService.popUp("Invalid input.");
      return;
    }
    ConnConfUtil.setBackendAddr(this.settingsForm.controls.backendAddr.value);
    this.webSocketService.init();
    this.notificationService.popUp("Saved settings.");
  }

  toggleDarkTheme(checked: boolean): void {
    this.themingService.setDarkTheme(checked);
  }
}
