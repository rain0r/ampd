import { Injectable, signal, WritableSignal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FilterService {
  message: WritableSignal<string> = signal<string>("");

  setMessage(text: string) {
    console.log("FilterService:", text);
    this.message.set(text);
  }

  getMessage(): string {
    return this.message();
  }
}
