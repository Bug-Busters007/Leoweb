import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {BarController, BarElement, CategoryScale, Chart, LinearScale} from "chart.js";
Chart.register(BarController, BarElement, CategoryScale, LinearScale);

@Component({
  selector: 'app-bar-chart',
  standalone: true,

  templateUrl: './bar-chart.component.html',
  imports: [],
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent implements AfterViewInit {

  @Input() input: Object = {GER: 10, FRA: 40, USA: 50};
  @Input() size: [number, number] = [1000, 500];
  @ViewChild('barCanvas') barCanvas!: ElementRef;

  chart!: Chart;

  ngAfterViewInit() {
    if (this.barCanvas) {
      this.createChart();
    } else {
      console.error('Canvas-Element nicht gefunden!');
    }
  }

  createChart() {
    const map = new Map<string, number>(Object.entries(this.input));
    const labels: string[] = Array.from(map.keys());
    const data: number[] = Array.from(map.values());

    this.chart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Werte',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'linear',
            beginAtZero: true
          }
        }
      }
    });
}
}
