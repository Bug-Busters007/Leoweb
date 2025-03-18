import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css',
  imports: [NgxChartsModule]
})
export class PieChartComponent {
  //colorScheme = {
  //  domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  //};

  colorScheme = 'vivid';

  single = [
    { "name": "Germany", "value": 894e4 },
    { "name": "USA", "value": 5e6 },
    { "name": "France", "value": 3e6 }
  ];
}
