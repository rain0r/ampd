import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NotificationService } from "../../../shared/services/notification.service";
import { SettingsService } from "../../../shared/services/settings.service";

@Component({
  selector: "app-backend-address",
  templateUrl: "./backend-address.component.html",
  styleUrls: ["./backend-address.component.scss"],
})
export class BackendAddressComponent {
  settingsForm: FormGroup;

  constructor(
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private settingsService: SettingsService
  ) {
    this.settingsForm = this.buildSettingsForm();
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) {
      this.notificationService.popUp("Invalid input.");
      return;
    }
    this.settingsService.setBackendAddr(
      this.settingsForm.controls["backendAddr"].value as string
    );
    this.notificationService.popUp("Saved backend address.");
  }

  private buildSettingsForm(): FormGroup {
    return this.formBuilder.group({
      backendAddr: [
        this.settingsService.getBackendContextAddr(),
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
      ],
    });
  }
}
