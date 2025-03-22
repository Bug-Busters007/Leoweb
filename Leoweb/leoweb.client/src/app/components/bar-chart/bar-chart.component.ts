import {Component, Input, OnInit} from '@angular/core';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {IPieChartData} from "../../../models/chartModel";

@Component({
  selector: 'app-bar-chart',
  standalone: true,

  templateUrl: './bar-chart.component.html',
  imports: [
    NgxChartsModule
  ],
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent implements OnInit {

  @Input() input: Object = {GER: 10, FRA: 40, USA: 50};
  @Input() size: [number, number] = [1000, 500];
  single: {name: string, value: number}[] = [];
  gradient = false;
  colorScheme = 'vivid';
  data: IPieChartData[] = [];

  ngOnInit(){
    const map = new Map<string, number>(Object.entries(this.input));
    this.data = Array.from(map.entries()).map(([name, value]) => ({
      data: { name, value }
    }));
    this.single = this.data.map(d => ({ name: d.data.name, value: d.data.value }));
  }
}
