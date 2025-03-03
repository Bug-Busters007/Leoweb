import { Component } from '@angular/core';
import { NgIf, NgFor } from "@angular/common";
import { getAllBranchesWithSubjects } from "../../leo-library/leo-library-helper";
import { HttpClient } from "@angular/common/http";
import { ApiService } from "../../../services/api.service";
import { UpdateSearchService } from "../../../services/update-search.service";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {RefreshService} from "../../../services/refresh.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.css',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSlideToggleModule,
    NgIf,
    NgFor,
  ]
})
export class FilterBarComponent {
  activeFilters: string[] = this.updateSearchService.getFilters();
  visibilityMap: Map<string, boolean> = new Map<string, boolean>();
  subjectMap: Map<string, string[]> | undefined = new Map<string, string[]>();
  private refreshSubscription: Subscription| null = null;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private updateSearchService: UpdateSearchService,
    private refreshService: RefreshService
  ) { }

  toggleValue(subject: string, isChecked: boolean) {
    if (isChecked && !this.activeFilters.includes(subject)) {
      this.activeFilters.push(subject);
    } else {
      this.activeFilters = this.activeFilters.filter(s => s !== subject);
    }
    this.updateSearchService.setFilters(this.activeFilters);
    this.updateSearchService.updateData();
  }


  async ngOnInit() {
    this.subjectMap = await getAllBranchesWithSubjects(this.http, this.apiService);
    this.visibilityMap = new Map<string, boolean>(
      Array.from(this.subjectMap!.keys()).map(key => [key, false])
    );
    this.refreshSubscription = this.refreshService.refresh$.subscribe(async () => {
      this.activeFilters = this.updateSearchService.getFilters();
    });
  }

  toggleVisibility(key: string) {
    this.visibilityMap.set(key, !this.visibilityMap.get(key));
  }

  getSubjectsFromBranch(branch: string) {
    return this.subjectMap!.get(branch.toLowerCase());
  }

  get subjectMapKeys() {
    return Array.from(this.subjectMap!.keys()).map(k =>
      k ? k[0].toUpperCase() + k.slice(1) : ''
    );
  }
}
