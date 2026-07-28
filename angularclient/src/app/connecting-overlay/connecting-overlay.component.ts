import { AsyncPipe } from "@angular/common";
import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { interval, map, Observable, take } from "rxjs";

@Component({
  selector: "app-connecting-overlay",
  templateUrl: "./connecting-overlay.component.html",
  styleUrl: "./connecting-overlay.component.css",
  imports: [MatProgressSpinner, MatDialogContent, MatDialogActions, AsyncPipe],
})
export class ConnectingOverlayComponent {
  private destroyRef = inject(DestroyRef);
  private dialogRef = inject(MatDialogRef<ConnectingOverlayComponent>);

  counter$: Observable<number>;

  readonly seconds = 5;

  constructor() {
    this.counter$ = interval(1000).pipe(
      take(this.seconds),
      map((t) => Math.abs(t - this.seconds)),
    );
    this.counter$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      complete: () => this.dialogRef.close(),
    });
  }
}
