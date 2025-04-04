import {provideRouter, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app.component";
import {LeoLibraryComponent} from "./leo-library/leo-library.component";
import {HeaderComponent} from "./components/header/header.component";
import {FileUploadComponent} from "./components/file-upload/file-upload.component";
import {authGuard} from "./auth.guard";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./auth/login/login.component').then(m => m.LoginComponent);
    },
  },
  {
    path: 'home',
    loadComponent: () =>{
      return import('./home/home.component').then(m => m.HomeComponent);
    },
    canActivate: [authGuard]
  },
  {
    path: 'leolibrary',
    loadComponent: () =>{
      return import('./leo-library/leo-library.component').then(m => m.LeoLibraryComponent);
    },
    canActivate: [authGuard]
  },
  {
    path: 'leochat',
    loadComponent: () =>{
      return import('./leo-chat/leo-chat.component').then(m => m.LeoChatComponent);
    },
    canActivate: [authGuard]
  },
  {
    path: 'leopoll',
    loadComponent: () => {
      return import('./leo-poll/leo-poll.component').then(m => m.LeoPollComponent);
    },
    canActivate: [authGuard]
  },
  {
    path: 'adminOverview',
    loadComponent: () => {
      return import('./components/admin/admin-overview/admin-overview.component').then(m => m.AdminOverviewComponent);
    },
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'accountSettings',
    loadComponent: () => import('./account-settings/account-settings.component').then(m => m.AccountSettingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'UserOverview',
    loadComponent: () => import('./components/user-overview/user-overview.component').then(m => m.UserOverviewComponent),
    canActivate: [authGuard]
  },
  {
    path: 'leoEvents',
    loadComponent: () => import('./components/scraper-test/scraper-test.component').then(m => m.ScraperTestComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  }
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideAnimationsAsync()]
});
