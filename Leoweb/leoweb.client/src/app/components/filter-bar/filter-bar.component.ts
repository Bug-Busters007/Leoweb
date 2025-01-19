import { Component } from '@angular/core';
import { NgIf, NgFor} from "@angular/common";
import {getAllSubjectsFromBranch} from "../../leo-library/leo-library-helper";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../services/api.service";
import {RefreshService} from "../../refresh.service";

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
  visibilityMap: { [key: string]: boolean } = {
    informatik: false,
    medientechnik: false,
    medizintechnik: false,
    elektronik: false,
  };
  constructor(private http: HttpClient, private apiService: ApiService, private refreshService: RefreshService) {}
  subjectsInformatik: string[] | undefined= [];
  subjectsMedientechnik: string[] | undefined= [];
  subjectsMedizintechnik: string[] | undefined= [];
  subjectsElektronik: string[] | undefined= [];
  filteredFiles: string[] = [];
  async ngOnInit() {
    this.subjectsInformatik = await getAllSubjectsFromBranch(this.http, this.apiService, 'Informatik');
    this.subjectsMedientechnik = await getAllSubjectsFromBranch(this.http, this.apiService, 'Medientechnik');
    this.subjectsMedizintechnik = await getAllSubjectsFromBranch(this.http, this.apiService, 'Medizintechnik');
    this.subjectsElektronik = await getAllSubjectsFromBranch(this.http, this.apiService, 'Elektronik');
  }

  toggleVisibility(key: string){
    this.visibilityMap[key] = !this.visibilityMap[key];
  }

  /*public getArray(){
    return this.filteredFiles;
  }*/
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
    this.refreshService.triggerRefresh();
  }
}
