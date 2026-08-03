import {
  Component,
  DestroyRef,
  Input,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatMiniFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { LoggerService } from "../../../service/logger.service";
import { RadioStreamService } from "../../../service/radio-stream.service";

@Component({
  selector: "app-import-radio-streams",
  templateUrl: "./import-radio-streams.component.html",
  styleUrls: ["./import-radio-streams.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatMiniFabButton, MatIcon],
})
export class ImportRadioStreamsComponent {
  private destroyRef = inject(DestroyRef);
  private logger = inject(LoggerService);
  private radioStreamService = inject(RadioStreamService);

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
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => window.location.reload());
    }
  }
}
