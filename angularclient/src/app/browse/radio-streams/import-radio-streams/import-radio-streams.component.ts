import { Component, Input, inject } from "@angular/core";
import { LoggerService } from "src/app/service/logger.service";
import { RadioStreamService } from "src/app/service/radio-stream.service";
import { NgIf } from "@angular/common";
import { MatMiniFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-import-radio-streams",
  templateUrl: "./import-radio-streams.component.html",
  styleUrls: ["./import-radio-streams.component.scss"],
  imports: [NgIf, MatMiniFabButton, MatIcon],
})
export class ImportRadioStreamsComponent {
  private radioStreamService = inject(RadioStreamService);
  private logger = inject(LoggerService);

  @Input()
  requiredFileType = "application/json";
  fileName = "";
  exampleJson = `[
  {
    "name": "Radio A",
    "url": "https://example.com/1.m3u"
  },
  {
    "name": "Radio B",
    "url": "https://example.com/2.m3u"
  }
]`;

  onFileSelected(event: Event): void {
    if (!event.target) {
      this.logger.error("No or invalid event: ", event);
      return;
    }

    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("radio-stations", file);

      this.radioStreamService
        .uploadImportFile(formData)
        .subscribe(() => window.location.reload());
    }
  }
}
