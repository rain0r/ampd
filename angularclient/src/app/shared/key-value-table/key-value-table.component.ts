import { KeyValue, NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import {
  MatTable,
  MatColumnDef,
  MatCellDef,
  MatCell,
  MatRowDef,
  MatRow,
} from "@angular/material/table";

@Component({
  selector: "app-key-value-table",
  templateUrl: "./key-value-table.component.html",
  styleUrls: ["./key-value-table.component.scss"],
  imports: [
    NgIf,
    MatTable,
    MatColumnDef,
    MatCellDef,
    MatCell,
    MatRowDef,
    MatRow,
  ],
})
export class KeyValueTableComponent {
  @Input() dataSource: KeyValue<string, string>[] = [];
  displayedColumns: string[] = ["key", "value"];
}
