import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';

@NgModule({
  declarations: [
    AppComponent,
    PieChartComponent,
    AdminOverviewComponent
  ],
  imports: [
    BrowserModule,
    NgxChartsModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
