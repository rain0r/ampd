export class FormField {
  key: string;
  label: string;
  required: boolean;
  validator: string;
  controlType: string;
  type: string;
  options: { key: string; value: string }[];

  constructor(
    options: {
      key?: string;
      label?: string;
      required?: boolean;
      validator?: string;
      controlType?: string;
      type?: string;
      options?: { key: string; value: string }[];
    } = {},
  ) {
    this.key = options.key || "";
    this.label = options.label || "";
    this.required = !!options.required;
    this.validator = options.validator || "";
    this.controlType = options.controlType || "";
    this.type = options.type || "";
    this.options = options.options || [];
  }
}
