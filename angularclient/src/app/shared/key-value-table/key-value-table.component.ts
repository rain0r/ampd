import { KeyValue } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-key-value-table",
  templateUrl: "./key-value-table.component.html",
  styleUrls: ["./key-value-table.component.scss"],
})
export class KeyValueTableComponent {
  @Input() dataSource: KeyValue<string, string>[] = [];
  displayedColumns: string[] = ["key", "value"];
}
