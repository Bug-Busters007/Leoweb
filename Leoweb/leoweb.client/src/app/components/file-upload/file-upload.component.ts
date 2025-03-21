import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";
import {getAllBranchesWithSubjects} from "../../leo-library/leo-library-helper";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../services/api.service";
import {RefreshService} from "../../../services/refresh.service";
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {MatCard} from "@angular/material/card";


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
  standalone: true,
  imports: [
    MatSelectModule,
    NgForOf,
    MatButton,
    MatCard,
  ]
})
export class FileUploadComponent {
  subjectsMap: Map<string, string[]> | undefined = new Map();
  selectedFileName: string= "File";
  selectedFile: File | null = null;
  subject: string = "AM";
  branch: string = "Informatik";
  year: string = "1";
  lessonsSelectOptions: string[]|undefined = undefined;
  setYear(event: MatSelectChange): void {
    this.year = event.value;
  }

  setSubject(event: MatSelectChange): void {
    this.subject = event.value;
  }
  branchSelectOptions = ['Informatik', 'Medientechnik', 'Medizintechnik','Elektronik'];

  async setBranch(event: MatSelectChange) {
    this.branch = event.value;
    this.lessonsSelectOptions = this.subjectsMap!.get(this.branch.toLowerCase());
  }
  constructor(private http: HttpClient, private apiService: ApiService, private refreshService: RefreshService) {
  }

  public async ngOnInit() {
    this.subjectsMap = await getAllBranchesWithSubjects(this.http, this.apiService);
    this.lessonsSelectOptions = this.subjectsMap!.get(this.branch.toLowerCase());
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

    console.log(`${url}?subject=${this.subject}&year=${this.year}`);
    this.http.post(`${url}?subject=${this.subject}&year=${this.year}`, formData).subscribe({
      next: (response) => {
        console.log('Upload successful!', response);
        this.refreshService.triggerRefresh();
        alert("Upload successful!");
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
}
