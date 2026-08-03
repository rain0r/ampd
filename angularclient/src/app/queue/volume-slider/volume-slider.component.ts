import {
  Component,
  DestroyRef,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";

import { AsyncPipe } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import { MatSlider, MatSliderThumb } from "@angular/material/slider";
import { Observable } from "rxjs";
import { MpdService } from "../../service/mpd.service";
import { VolumeService } from "../../service/volume.service";

@Component({
  selector: "app-volume-slider",
  templateUrl: "./volume-slider.component.html",
  styleUrls: ["./volume-slider.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIcon, MatSlider, MatSliderThumb, FormsModule, AsyncPipe],
})
export class VolumeSliderComponent {
  private destroyRef = inject(DestroyRef);
  private mpdService = inject(MpdService);
  private volumeService = inject(VolumeService);

  volume = 0;
  connected$: Observable<boolean>;
  state$: Observable<string>;

  constructor() {
    const volumeService = this.volumeService;

    volumeService.volume
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((volume) => (this.volume = volume));
    this.connected$ = this.mpdService.isConnected$();
    this.state$ = this.mpdService.currentState$;
  }

  handleVolumeSlider(value: number): void {
    this.volume = value;
    this.volumeService.setVolume(value);
  }
}
