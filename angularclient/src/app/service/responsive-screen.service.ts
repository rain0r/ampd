import { BreakpointObserver } from "@angular/cdk/layout";
import { DestroyRef, Injectable, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ResponsiveScreenService {
  private breakpointObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);

  isMobile(): Observable<boolean> {
    return this.breakpointObserver.observe(["(max-width: 768px)"]).pipe(
      takeUntilDestroyed(this.destroyRef),
      map((bp) => bp.matches),
    );
  }
}
