import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormField } from "../shared/search/form-field";

@Component({
  selector: "app-dynamic-form-input",
  templateUrl: "./dynamic-form-input.component.html",
  styleUrls: ["./dynamic-form-input.component.scss"],
})
export class DynamicFormInputComponent {
  @Input() input: FormField = <FormField>{};
  @Input() form: FormGroup = <FormGroup>{};

  get isValid(): boolean {
    return this.form.controls[this.input.key].valid;
  }
}
