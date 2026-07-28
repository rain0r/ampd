import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { RadioStreamService } from "../../../service/radio-stream.service";
import { RadioStream } from "../../../shared/model/db/radio-stream";

@Component({
  selector: "app-add-radio-stream",
  templateUrl: "./add-radio-stream.component.html",
  styleUrls: ["./add-radio-stream.component.scss"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
  ],
})
export class AddStreamComponent {
  private destroyRef = inject(DestroyRef);
  private radioStreamService = inject(RadioStreamService);

  radioStreamForm = new FormGroup({
    name: new FormControl("", Validators.required),

    url: new FormControl("", Validators.required),
  });

  onSubmit(): void {
    this.radioStreamService
      .addRadioStream({
        name: String(this.name.value),
        url: String(this.url.value),
      } as RadioStream)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.radioStreamForm.reset();
        window.location.reload();
      });
  }

  get name(): FormControl {
    return this.radioStreamForm.get("name") as FormControl;
  }

  get url(): FormControl {
    return this.radioStreamForm.get("url") as FormControl;
  }
}
