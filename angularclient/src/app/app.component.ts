import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';
  connectedStatusIcon = 'cloud_off';
  innerWidth: number;

  @ViewChild('inputSearch') inputSearch?: ElementRef;

  constructor(private router: Router) {
    this.innerWidth = window.innerWidth;
  }

  setConnected() {
    this.connectedStatusIcon = 'cloud';
  }

  setDisconnected() {
    this.connectedStatusIcon = 'cloud_off';
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.which === 13) {
      if (this.inputSearch) {
        const query: string = this.inputSearch.nativeElement.value;
        if (query.trim().length > 0) {
          this.router.navigate(['search'], { queryParams: { query } });
        }
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  isMobile(): boolean {
    return this.innerWidth <= 600;
  }
}
