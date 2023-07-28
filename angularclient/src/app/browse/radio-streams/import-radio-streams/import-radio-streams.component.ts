import { Component, Input } from "@angular/core";
import { LoggerService } from "src/app/service/logger.service";
import { RadioStreamService } from "src/app/service/radio-stream.service";

@Component({
  selector: "app-import-radio-streams",
  templateUrl: "./import-radio-streams.component.html",
  styleUrls: ["./import-radio-streams.component.scss"],
})
export class ImportRadioStreamsComponent {
  @Input()
  requiredFileType = "application/json";
  fileName = "";
  exampleJson = `{
    "streams":[
       {
          "name":"import 1",
          "url":"https://example.com/1.m3u"
       },
       {
          "name":"import 2",
          "url":"https://example.com/2.m3u"
       }
    ]
 }`;

  constructor(
    private radioStreamService: RadioStreamService,
    private logger: LoggerService
  ) {}

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
