import {provideRouter, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app.component";
import {LeoLibraryComponent} from "./leo-library/leo-library.component";
import {ModuleComponent} from "./components/module/module.component";
import {HeaderComponent} from "./components/header/header.component";
import {FileUploadComponent} from "./components/file-upload/file-upload.component";
import {authGuard} from "./auth.guard";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
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
    path: '**',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  }
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
