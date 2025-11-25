import {
  enableProdMode,
  ErrorHandler,
  importProvidersFrom,
  provideZoneChangeDetection,
} from "@angular/core";

import { ScrollingModule } from "@angular/cdk/scrolling";
import { Location } from "@angular/common";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from "@angular/material/tooltip";
import { bootstrapApplication, BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app/app-routing.module";
import { AppComponent } from "./app/app.component";
import { AmpdRxStompConfigService } from "./app/service/ampd-rx-stomp-config.service";
import { AmpdRxStompService } from "./app/service/ampd-rx-stomp.service";
import { SettingsService } from "./app/service/settings.service";
import { AmpdErrorHandler } from "./app/shared/ampd-error-handler";
import { CamelCaseTitlePipe } from "./app/shared/pipes/camel-case-title.pipe";
import { ReplaceNullWithTextPipe } from "./app/shared/pipes/replace-null-with-text.pipe";
import { SecondsToMmSsPipe } from "./app/shared/pipes/seconds-to-mm-ss.pipe";
import { StyleManager } from "./app/shared/style-manager";
import { environment } from "./environments/environment";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    importProvidersFrom(
      AppRoutingModule,
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      ScrollingModule,
    ),
    CamelCaseTitlePipe,
    ReplaceNullWithTextPipe,
    SecondsToMmSsPipe,
    StyleManager,
    {
      provide: AmpdRxStompService,
      useFactory: () => {
        const config = new AmpdRxStompConfigService();
        const rxStomp = new AmpdRxStompService();
        rxStomp.configure(config);
        rxStomp.activate();
        return rxStomp;
      },
      deps: [Location, SettingsService],
    },
    {
      provide: ErrorHandler,
      useClass: AmpdErrorHandler,
    },
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: {
        showDelay: 750,
      },
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        backdropClass: "backdrop-brightness-50",
        panelClass: "dialog-panel-class",
      },
    },
  ],
}).catch((err) => console.log(err));
