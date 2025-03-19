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

  dataAr = [
    { "name": "Germany", "value": 20 },
    { "name": "USA", "value": 20 },
    { "name": "France", "value": 60 }
  ];

  data = this.dataAr.map(item => ({
    name: item.name,
    value: item.value 
  }));

  single = this.data.map(v => ({ name: v.name, value: v.value }));

  formatLabel(value: string): string {
    console.log(value);
    return value;
  }
}
