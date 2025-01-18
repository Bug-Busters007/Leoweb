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
  fileNames: Map<number, string> | null = null;
  fileArray: { id: number; name: string }[] = [];
  isUploadDivVisible = false;

  constructor(private http: HttpClient, private apiService: ApiService) {
  }
  makeVisible(){
    if(this.isUploadDivVisible){
      this.isUploadDivVisible = false;
    }
    else{
      this.isUploadDivVisible = true;
    }
  }
  public async ngOnInit() {
    this.fileNames = await this.getFileNames();
    this.fileArray = Array.from(this.fileNames, ([id, name]) => ({ id, name }));
  }

  public async getFileNames(): Promise<Map<number, string>> {
    const url = this.apiService.getApiUrl('Notes/allFileNames');
    console.log(url);
    try {
      const response: { id: number; name: string }[] | undefined = await this.http
        .get<{ id: number; name: string }[]>(url)
        .toPromise();
      if (response) {
        return new Map(response.map(file => [file.id, file.name]));
      }
    } catch (error) {
      console.error('Error fetching file names:', error);
      throw new Error('Failed to fetch file names');
    }
    return new Map<number, string>;
  }
}
