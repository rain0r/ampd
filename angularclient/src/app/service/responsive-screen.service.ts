import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ResponsiveScreenService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  isMobile(): Observable<boolean> {
    return this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
        Breakpoints.Handset,
        Breakpoints.Tablet,
        Breakpoints.Web,
        Breakpoints.HandsetPortrait,
        Breakpoints.TabletPortrait,
        Breakpoints.WebPortrait,
        Breakpoints.HandsetLandscape,
        Breakpoints.TabletLandscape,
        Breakpoints.WebLandscape,
      ])
      .pipe(
        map((breakpoint) => {
          if (
            breakpoint.breakpoints[Breakpoints.XSmall] ||
            breakpoint.breakpoints[Breakpoints.Small]
          ) {
            return true;
          } else {
            return false;
          }
        })
      );
  }

  getCoverCssClass(): Observable<string> {
    return this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(
        map((breakpoint: BreakpointState) => {
          if (breakpoint.breakpoints[Breakpoints.XSmall]) {
            return "cover-xsmall";
          }
          if (breakpoint.breakpoints[Breakpoints.Small]) {
            return "cover-small";
          }
          if (breakpoint.breakpoints[Breakpoints.Medium]) {
            return "cover-medium";
          }
          if (breakpoint.breakpoints[Breakpoints.Large]) {
            return "cover-large";
          }
          if (breakpoint.breakpoints[Breakpoints.XLarge]) {
            return "cover-xlarge";
          }
          return "cover-small";
        })
      );
  }
}
