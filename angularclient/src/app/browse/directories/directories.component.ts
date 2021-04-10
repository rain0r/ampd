import { Component, Input, OnInit } from "@angular/core";
import { MessageService } from "../../shared/services/message.service";
import { Filterable } from "../filterable";
import { Observable } from "rxjs";
import { Directory } from "../../shared/messages/incoming/directory";
import { SettingsService } from "../../shared/services/settings.service";

@Component({
  selector: "app-directories",
  templateUrl: "./directories.component.html",
  styleUrls: ["./directories.component.scss"],
})
export class DirectoriesComponent extends Filterable implements OnInit {
  @Input() directories: Directory[] = [];
  @Input() dirQp = "/";
  filterVisible = false;
  filterByStartCharValue = "";
  letters: Set<string> = new Set<string>();
  virtualScroll: Observable<boolean>;

  constructor(
    private messageService: MessageService,
    private settingsService: SettingsService
  ) {
    super(messageService);
    this.virtualScroll = this.settingsService.getFrontendSettings().virtualScroll;
  }

  ngOnInit(): void {
    this.buildLetters();
  }

  toggleFilter(): void {
    this.filterVisible = !this.filterVisible;
  }

  setStartLetterFilter(letter: string): void {
    if (letter === "") {
      this.filterVisible = false;
    }
    this.filterByStartCharValue = letter.substr(0, 1).toUpperCase();
  }

  private buildLetters(): void {
    const letters = new Set<string>();
    this.directories.forEach((val) => {
      letters.add(val.path.substr(0, 1).toUpperCase());
    });
    this.letters = letters;
  }
}
