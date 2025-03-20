import { Component, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { IPieChartData } from '../../../models/chartModel'

@Component({
  selector: 'app-pie-chart',
  standalone: true,

  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css',
  imports: [NgxChartsModule]
})
export class PieChartComponent {
  @Input() input: Map<string, number> = new Map<string, number>;

  data: IPieChartData[] = [
    { data: { name: 'GER', value: 40, label: '' } },
    { data: { name: 'USA', value: 40, label: '' } },
    { data: { name: 'FRA', value: 120, label: '' }}
  ];


  single = this.data.map(d => d.data);

  colorScheme = 'vivid';

  getPercentage(value: number): string {
    const sum = this.data.reduce((acc, val) => acc + val.data.value, 0);
    return (value / sum * 100).toFixed(0);
  }

  formatLabel = (value: string): string => {
    const d = this.data.find(d => d.data.name === value);
    return `${d?.data.name} (${this.getPercentage(d?.data.value ?? 0)}%)`;
  }
}

