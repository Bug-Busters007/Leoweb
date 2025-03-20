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
  @Input() input: Map<string, number> = new Map<string, number>([
    ['GER', 40],
    ['USA', 40],
    ['FRA', 120]
  ]);

  ngOnInit() {
    this.data = Array.from(this.input.entries()).map(([name, value]) => ({
      data: { name, value }
    }));
    this.single = this.data.map(d => ({ name: d.data.name, value: d.data.value }));
  }

  data: IPieChartData[] = [];

  single: {name: string, value: number}[] = [];

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
