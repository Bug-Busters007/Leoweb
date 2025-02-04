import { Component } from '@angular/core';
import { NgIf, NgFor} from "@angular/common";
import { getAllBranchesWithSubjects} from "../../leo-library/leo-library-helper";
import { HttpClient} from "@angular/common/http";
import { ApiService} from "../../../services/api.service";
import { UpdateSearchService } from "../../../services/update-search.service";

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.css',
  standalone: true,
  imports:[
    NgIf,
    NgFor,
  ]
})
export class FilterBarComponent {
  visibilityMap: Map<string, boolean> = new Map<string, boolean>();
  subjectMap: Map<string, string[]> | undefined = new Map<string, string[]>();
  constructor(private http: HttpClient, private apiService: ApiService, private dataService: UpdateSearchService) {}
  subjectsInformatik: string[] | undefined = [];
  subjectsMedientechnik: string[] | undefined = [];
  subjectsMedizintechnik: string[] | undefined = [];
  subjectsElektronik: string[] | undefined = [];
  filteredFiles: string[] = [];
  async ngOnInit() {
    this.subjectMap = await getAllBranchesWithSubjects(this.http, this.apiService);
    this.visibilityMap = new Map<string, boolean>(
      Array.from(this.subjectMap!.keys()).map(key => [key, false])
    );
  }

  toggleVisibility(key: string){
    this.visibilityMap.set(key, !this.visibilityMap.get(key));
  }

  toggleValue(subject: string, $event: Event) {
    if (event === undefined) {
      return;
    }
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.filteredFiles.push(subject);
      console.log(this.filteredFiles);
    } else {
      this.filteredFiles = this.filteredFiles.filter(s => s !== subject);
    }
    this.dataService.updateData(this.filteredFiles);
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
