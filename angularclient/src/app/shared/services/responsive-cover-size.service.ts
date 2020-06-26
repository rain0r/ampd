import { Injectable } from "@angular/core";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ResponsiveCoverSizeService {
  constructor(private breakpointObserver: BreakpointObserver) {}

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
