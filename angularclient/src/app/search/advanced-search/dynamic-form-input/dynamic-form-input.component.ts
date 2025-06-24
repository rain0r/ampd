import { Component, Input } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormField } from "../../../shared/search/form-field";
import { NgSwitch, NgSwitchCase } from "@angular/common";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";

@Component({
  selector: "app-dynamic-form-input",
  templateUrl: "./dynamic-form-input.component.html",
  styleUrls: ["./dynamic-form-input.component.scss"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgSwitch,
    NgSwitchCase,
    MatFormField,
    MatLabel,
    MatInput,
  ],
})
export class DynamicFormInputComponent {
  @Input() input: FormField = {} as FormField;
  @Input() form: FormGroup = {} as FormGroup;

  get isValid(): boolean {
    return this.form.controls[this.input.key].valid;
  }
}
