import { Component } from '@angular/core';
import {FileDisplayComponent} from "../file-display/file-display.component";
import {NgForOf} from "@angular/common";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../services/api.service";
import {RefreshService} from "../../refresh.service";
import {UpdateSearchService} from "../../update-search.service";
import {Spinner} from "../spinner/spinner";

@Component({
  selector: 'app-file-search',
  templateUrl: './file-search.component.html',
  imports: [
    FileDisplayComponent,
    NgForOf
  ],
  standalone: true,
  styleUrls: ['./file-search.component.css']
})
export class FileSearchComponent {
  fileArray: { id: number; name: string; year: number,student: string, subject: string }[] = [];
  allFiles: { id: number; name: string; year: number,student: string, subject: string }[] = [];
  filterSubjects:string[]= [];
  private refreshSubscription: Subscription|null = null;
  /*
    @ViewChild(FilterBarComponent) sidebar!: FilterBarComponent;
    filteredFilesSubject = this.sidebar.getArray();*/
  constructor(private http: HttpClient, private apiService: ApiService, private refreshService: RefreshService, private updateSearchService: UpdateSearchService) {
  }
  public async ngOnInit() {
    this.allFiles = await this.getFileNames();
    this.fileArray = this.allFiles

    this.refreshSubscription = this.refreshService.refresh$.subscribe(async () => {
      this.allFiles = await this.getFileNames();
      this.fileArray = this.allFiles;
    });
    this.updateSearchService.currentData.subscribe((data) =>{
      this.filterSubjects = data;
      this.fileArray = this.filterFilesSubject();
    })
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

    filterFilesSubject(){
      if (this.filterSubjects.length !== 0){
        const filterFiles:{ id: number; name: string; year: number,student: string, subject: string }[] = [];
        for (const subject of this.filterSubjects) {
          for (const file of this.allFiles) {
            if (file.subject === subject && !filterFiles.includes(file)) {
              filterFiles.push(file);
            }
          }
        }
        return  filterFiles;
      }
      return  this.allFiles;
    }
  filterFilesRegex(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value === ""){
      this.fileArray = this.allFiles;
      return;
    }
    const searchTerm = new RegExp(input.value, "i");
    const newFiles = [];
    for (const file of this.fileArray) {
      if (searchTerm.test(file.name)||searchTerm.test(file.year.toString())||searchTerm.test(file.subject)) {
        newFiles.push(file);
      }
    }
    this.fileArray = newFiles;
  }

  public async getFileNames(): Promise<{id: number, name: string, year: number,student: string, subject: string}[]> {

    const list = document.getElementById('filesListed');
    const spinner = new Spinner(list);
    spinner.showSpinner();


    const url = this.apiService.getApiUrl('Notes/allFileNames');
    console.log(url);
    try {
      const response: { id: number; name: string; year: number; student: string; subject: string }[] | undefined = await this.http
        .get<{ id: number; name: string; year: number;student: string; subject: string }[]>(url)
        .toPromise();
      if (response) {
        spinner.removeSpinner();
        return response;
      }
    } catch (error) {
      console.error('Error fetching file names:', error);
      throw new Error('Failed to fetch file names');
    }
    return[];
  }
}
