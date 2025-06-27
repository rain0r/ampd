import { Pipe, PipeTransform } from "@angular/core";
import { KeyValue } from "@angular/common";

@Pipe({ name: "mapEntries" })
export class MapEntriesPipe implements PipeTransform {
  transform<K, V>(input: Map<K, V>): readonly KeyValue<K, V>[] {
    return Array.from(input ?? []).map(([key, value]) => ({ key, value }));
  }
}
