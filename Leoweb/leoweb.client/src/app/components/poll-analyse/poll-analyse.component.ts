import {Component, Input, OnInit} from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {PollOverview} from "../../../models/pollOverviewModel";
import {PieChartComponent} from "../pie-chart/pie-chart.component";
import {NgIf} from "@angular/common";
import {BarChartComponent} from "../bar-chart/bar-chart.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";

@Component({
  selector: 'app-poll-analyse',
  standalone: true,

  templateUrl: './poll-analyse.component.html',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    PieChartComponent,
    NgIf,
    BarChartComponent,
    MatTab,
    MatTabGroup
  ],
  styleUrl: './poll-analyse.component.css'
})
export class PollAnalyseComponent implements OnInit{
  @Input() pollOverview!: PollOverview;
  voteCount: number = 0;
  ngOnInit() {
    new Map<string, number>(Object.entries(this.pollOverview.votes)).forEach((count: number, _: string) => this.voteCount = this.voteCount + count);
  }
}
