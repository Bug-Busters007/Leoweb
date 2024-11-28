import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LeoLibraryComponent} from "../leo-library/leo-library.component";

const routes: Routes = [
  {path: './library', component: LeoLibraryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
