import { Component } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import {ApiService} from "../../services/api.service";
import {CommonModule} from "@angular/common";
import {AppComponent} from "../app.component";
import {FileDisplayComponent} from "../components/file-display/file-display.component";
import {PdfViewerComponent} from "../components/pdf-viewer/pdf-viewer.component";
import {getAllSubjectsFromBranch} from "./leo-library-helper";

@Component({
  selector: 'app-leo-library',
  templateUrl: './leo-library.component.html',
  styleUrls: ['./leo-library.component.css'],
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FileDisplayComponent,
  ]
})
export class LeoLibraryComponent {
  selectedFileName: string= "File";
  selectedFile: File | null = null;
  fileNames: Map<number, string> | null = null;
  fileArray: { id: number; name: string }[] = [];
  subject: string = "Programmieren";
  branch: string = "Informatik";
  year: string = "1";
  InfoSubjects: string[]|undefined= [];
  MedienSubjects: string[]|undefined= [];
  MedizinSubjects: string[]|undefined= [];
  ElektronikSubjects: string[]|undefined= [];

  setYear(event: Event): void {
    this.year = (event.target as HTMLInputElement).value;
  }

  setSubject(event: Event): void {
    this.subject = (event.target as HTMLInputElement).value;
  }
  zweigSelectOptions = ['Informatik', 'Medientechnik', 'Medizintechnik','Elektronik'];

  lessonsSelectOptions: string[]|undefined = this.InfoSubjects;

  optionsMap: { [key: string]: string[]|undefined } = {
    Informatik:  this.InfoSubjects,
    Medientechnik: this.MedienSubjects,
    Medizintechnik: this.MedizinSubjects,
    Elektronik: this.ElektronikSubjects,
  };

  onFirstSelectChange(event: Event): void {
    this.branch = (event.target as HTMLSelectElement).value;
    this.lessonsSelectOptions = this.optionsMap[this.branch] || [];
  }
  constructor(private http: HttpClient, private apiService: ApiService) {
  }

  public async ngOnInit() {
    this.fileNames = await this.getFileNames();
    this.fileArray = Array.from(this.fileNames, ([id, name]) => ({ id, name }));
    this.InfoSubjects = await getAllSubjectsFromBranch(this.http, this.apiService, "Informatik");
    this.MedienSubjects = await getAllSubjectsFromBranch(this.http, this.apiService, "Medientechnik");
    this.MedizinSubjects = await getAllSubjectsFromBranch(this.http, this.apiService, "Medizintechnik");
    this.ElektronikSubjects = await getAllSubjectsFromBranch(this.http, this.apiService, "Elektronik");
  }

  isUploadDivVisible = false;

  toggleUploadDiv(): void {
    this.isUploadDivVisible = !this.isUploadDivVisible;
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log("file selected")
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = input.files[0].name;
    }
    else {
      this.selectedFileName = "File";
    }
  }

  public onSubmit(event: Event): void {
    const url = this.apiService.getApiUrl('Notes');
    event.preventDefault();

    if (!this.selectedFile) {
      alert('Please select a file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post(`${url}?subject=${this.subject}`, formData).subscribe({
      next: (response) => {
        console.log('Upload successful!', response);
      },
      error: (err) => {
        if (err.status === 415) {
          alert("Please upload a .pdf file");
        }
        else{
          console.error('Upload failed!', err);
        }
      },
    });
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
