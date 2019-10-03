import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public title = 'app';
  public connectedStatusIcon = 'cloud_off';
  public innerWidth: number;

  @ViewChild('inputSearch', { static: false }) public inputSearch?: ElementRef;

  constructor(private router: Router) {
    this.innerWidth = window.innerWidth;
  }

  public setConnected() {
    this.connectedStatusIcon = 'cloud';
  }

  public setDisconnected() {
    this.connectedStatusIcon = 'cloud_off';
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyDown(event: KeyboardEvent) {
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
  public onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  public isMobile(): boolean {
    return this.innerWidth <= 600;
  }
}
