import {Component, Input} from '@angular/core';
import {PollOverview} from "../../../models/pollOverviewModel";
import {PieChartComponent} from "../pie-chart/pie-chart.component";
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-poll-result',
  standalone: true,

  templateUrl: './poll-result.component.html',
  imports: [
    PieChartComponent,
    MatCardModule
  ],
  styleUrl: './poll-result.component.css'
})
export class PollResultComponent {
  @Input() pollResult!: PollOverview;
}
