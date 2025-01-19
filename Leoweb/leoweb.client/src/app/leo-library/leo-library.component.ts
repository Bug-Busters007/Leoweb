import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ApiService} from "../../services/api.service";
import {CommonModule} from "@angular/common";
import {FileDisplayComponent} from "../components/file-display/file-display.component";
import {FileUploadComponent} from "../components/file-upload/file-upload.component";
import {HeaderComponent} from "../components/header/header.component";

@Component({
  selector: 'app-leo-library',
  templateUrl: './leo-library.component.html',
  styleUrls: ['./leo-library.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FileDisplayComponent,
    FileUploadComponent,
    HeaderComponent,
  ]
})
export class LeoLibraryComponent {
  fileArray: { id: number; name: string; year: number, subject: string }[] = [];
  isUploadDivVisible = false;

  constructor(private http: HttpClient, private apiService: ApiService) {
  }
  makeVisible(){
    this.isUploadDivVisible = !this.isUploadDivVisible;
  }
  public async ngOnInit() {
    this.fileArray = await this.getFileNames();
  }

  filterFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value === ""){
      this.ngOnInit();
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

  public async getFileNames(): Promise<{id: number, name: string, year: number, subject: string}[]> {
    const url = this.apiService.getApiUrl('Notes/allFileNames');
    console.log(url);
    try {
      const response: { id: number; name: string; year: number; subject: string }[] | undefined = await this.http
        .get<{ id: number; name: string; year: number; subject: string }[]>(url)
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
}
