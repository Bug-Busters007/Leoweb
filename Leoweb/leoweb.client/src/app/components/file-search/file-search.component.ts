import {Component, OnInit, OnDestroy} from '@angular/core';
import {FileDisplayComponent} from "../file-display/file-display.component";
import {NgForOf, NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../services/api.service";
import {RefreshService} from "../../../services/refresh.service";
import {UpdateSearchService} from "../../../services/update-search.service";
import {Spinner} from "../spinner/spinner";
import {SharedService} from "../../../services/share-name.service";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {LikesServiceService} from "../../../services/likes-service.service";
import {AdminOptionsComponent} from "../admin/admin-options/admin-options.component";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-file-search',
  templateUrl: './file-search.component.html',
  imports: [
    MatFormFieldModule,
    FileDisplayComponent,
    NgForOf,
    MatInput
  ],
  standalone: true,
  styleUrls: ['./file-search.component.css']
})

export class FileSearchComponent implements OnInit {
  fileArray: { id: number; name: string; year: number,student: string, subject: string, likesCount : number, liked : boolean }[] = [];
  allFiles: { id: number; name: string; year: number,student: string, subject: string, likesCount : number, liked : boolean }[] = [];
  filters: string[]= [];
  isAdmin: boolean = false;
  role: string = "";
  private refreshSubscription: Subscription|null = null;
  constructor(private http: HttpClient,
              private authService: AuthService,
              private apiService: ApiService,
              private refreshService: RefreshService,
              private updateSearchService: UpdateSearchService,
              private shareService: SharedService,
              private likeService: LikesServiceService) {
  }
  async ngOnInit() {
    this.allFiles = await this.getFileNames();
    this.fileArray = this.allFiles
    this.shareService.setFileArray(this.fileArray);
    this.refreshSubscription = this.refreshService.refresh$.subscribe(async () => {
      this.allFiles = await this.getFileNames();
      this.fileArray = this.allFiles;
      this.updateSearchService.updateData();
    });
    this.updateSearchService.currentData.subscribe((data) =>{
      this.filters = data;
      this.fileArray = this.filterFilesSubjectAndYear();
    });
    this.authService.getUserData().subscribe((data) => {
      this.role = data.role;
      this.isAdmin = this.role === "admin";
      console.log(`User is admin: ${this.isAdmin}`);
    });
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }

    filterFilesSubjectAndYear(){
      if (this.filters.length !== 0){
        const filterFiles:{ id: number; name: string; year: number,student: string, subject: string, likesCount : number, liked :boolean}[] = [];
        for (const filter of this.filters) {
          for (const file of this.allFiles) {
            if ((file.subject === filter || file.year === Number(filter.charAt(0))) && !filterFiles.includes(file)) {
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

  public async getFileNames(): Promise<{id: number, name: string, year: number,student: string, subject: string, likesCount : number,liked:boolean}[]> {
    const list = document.getElementById('filesListed');
    const spinner = new Spinner(list);
    spinner.showSpinner();


    const url = this.apiService.getApiUrl('Notes/allFileNames');
    const result : {id: number, name: string, year: number,student: string, subject: string, likesCount : number, liked:boolean}[]=[];
    console.log(url);
    try {
      const response: { id: number; name: string; year: number; student: string; subject: string }[] | undefined = await this.http
        .get<{ id: number; name: string; year: number;student: string; subject: string }[]>(url)
        .toPromise();
      if (response) {
        spinner.removeSpinner();
        const likesFromUser = await this.likeService.getLikedFileIds()??[];
        for(const file of response){
          result.push({id: file.id, name: file.name, year: file.year,student: file.student, subject: file.subject, likesCount : await this.likeService.getLikeCount(file.id) ?? 0, liked: likesFromUser.includes(file.id)});
        }
        return  result;
      }
    } catch (error) {
      console.error('Error fetching file names:', error);
      throw new Error('Failed to fetch file names');
    }
    return[];
  }
}
