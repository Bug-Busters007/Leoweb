import {provideRouter, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app.component";
import {LeoLibraryComponent} from "./leo-library/leo-library.component";
import {ModuleComponent} from "./components/module/module.component";
import {HeaderComponent} from "./components/header/header.component";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./home/home.component').then(m => m.HomeComponent);
    }
  },
  {
    path: 'leolibrary',
    loadComponent: () =>{
      return import('./leo-library/leo-library.component').then(m => m.LeoLibraryComponent);
    }
  },
  {
    path: '**',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  }
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
