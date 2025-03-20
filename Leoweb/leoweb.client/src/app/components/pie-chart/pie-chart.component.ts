import {Component, Input, OnInit} from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { IPieChartData } from '../../../models/chartModel'

@Component({
  selector: 'app-pie-chart',
  standalone: true,

  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css',
  imports: [NgxChartsModule]
})
export class PieChartComponent  implements OnInit{
  @Input() input: Object = {GER: 10, FRA: 40, USA: 50};

  ngOnInit() {
    const map = new Map<string, number>(Object.entries(this.input));
    this.data = Array.from(map.entries()).map(([name, value]) => ({
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

  formatTooltip = (d: IPieChartData): string => {
    return `${d?.data.name} (${this.getPercentage(d?.data.value ?? 0)}%) <br> ${d?.data.value}`;
  }
}
