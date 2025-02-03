import { Component, Input } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from "../../../services/api.service";
import {Spinner} from "../spinner/spinner";
import {FileDisplayComponent} from "../file-display/file-display.component";
import {ActivatedRoute} from '@angular/router';
import {SharedService} from "../../share-name.service";
@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  standalone: true,
  imports: [
    FileDisplayComponent
  ],
  styleUrl: './user-overview.component.css'
})
export class UserOverviewComponent {
  fileArray: { id: number; name: string; year: number, subject: string }[] = [];
  @Input() username: string = '';
  constructor(private http: HttpClient, private apiService: ApiService, private sharedService: SharedService) {}

  async ngOnInit() {
    this.username = this.sharedService.getInputValue();
    const spinner: Spinner = new Spinner(document.getElementById('filesListedOverview'));
    spinner.showSpinner();
    this.fileArray = await this.getFileNamesFromStudent();
    spinner.removeSpinner();
  }
  public async getFileNamesFromStudent(): Promise<{id: number, name: string, year: number, subject : string}[]> {
    const url = this.apiService.getApiUrl('Notes/allFilenamesFromStudent');
    console.log(url);
    try {
      const response: { id: number; name: string; year: number; subject: string }[] | undefined = await this.http
        .get<{ id: number; name: string; year: number; subject: string}[]>(url)
        .toPromise();
      if (response) {
        return response;
      }
    } catch (error) {
      console.error('Error fetching file names:', error);
      throw new Error('Failed to fetch file names');
    }
    return[];
  }

  goBack(): void {
    window.history.back();
  }
}
