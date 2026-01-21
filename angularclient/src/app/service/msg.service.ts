import { Injectable, signal, WritableSignal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FilterService {
  message: WritableSignal<string> = signal<string>("");
  exampleArrayOfObjects: WritableSignal<string> = signal<string>("");

  setMessage(text: string) {
    this.message.set(text);
  }

  getMessage(): string {
    return this.message();
  }
}
