  import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessageComponent } from './message/message.component';
  import {LeoLibraryComponent} from "../leo-library/leo-library.component";

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule, LeoLibraryComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
