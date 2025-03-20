import {Component, Input} from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {PollOverview} from "../../../models/pollOverviewModel";
import {PieChartComponent} from "../pie-chart/pie-chart.component";

@Component({
  selector: 'app-poll-analyse',
  standalone: true,

  templateUrl: './poll-analyse.component.html',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    PieChartComponent
  ],
  styleUrl: './poll-analyse.component.css'
})
export class PollAnalyseComponent {
  @Input() pollOverview!: PollOverview;

}
