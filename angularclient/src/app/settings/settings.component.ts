import {Component} from "@angular/core";
import {environment} from "../../environments/environment";
import {ConnConfUtil} from "../shared/conn-conf/conn-conf-util";
import {NotificationService} from "../shared/services/notification.service";
import {WebSocketService} from "../shared/services/web-socket.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: "app-settings",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
    ampdVersion: string;
    gitCommitId: string;
    settingsForm: FormGroup;

    constructor(
        private notificationService: NotificationService,
        private webSocketService: WebSocketService,
        private formBuilder: FormBuilder
    ) {
        const savedAddr = ConnConfUtil.getBrokerUrl();
        this.ampdVersion = environment.ampdVersion;
        this.gitCommitId = environment.gitCommitId;

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
}
