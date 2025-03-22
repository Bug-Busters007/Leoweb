import {Component, Input} from '@angular/core';
import {PollOverview} from "../../../models/pollOverviewModel";
import {PieChartComponent} from "../pie-chart/pie-chart.component";
import { MatCardModule } from '@angular/material/card';
import {BarChartComponent} from "../bar-chart/bar-chart.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";

@Component({
  selector: 'app-poll-result',
  standalone: true,

  templateUrl: './poll-result.component.html',
    imports: [
        PieChartComponent,
        MatCardModule,
        BarChartComponent,
        MatTab,
        MatTabGroup
    ],
  styleUrl: './poll-result.component.css'
})

export class PollResultComponent {
  @Input() pollResult!: PollOverview;
}
