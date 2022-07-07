import { HttpUrlEncodingCodec } from "@angular/common/http";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "encodeURIComponent" })
export class EncodeURIComponentPipe implements PipeTransform {
  private encoder = new HttpUrlEncodingCodec();
  transform(value: string): string {
    if (typeof value !== "string") {
      return value;
    }
    return this.encoder.encodeKey(value);
  }
}
