import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient} from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';


import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(MatDialogModule, BrowserAnimationsModule)
  ]
}).catch((err) => console.error(err));



