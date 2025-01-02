import { Component } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import {ApiService} from "../../services/api.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-leo-library',
  templateUrl: './leo-library.component.html',
  styleUrls: ['./leo-library.component.css'],
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
  ]
})
export class LeoLibraryComponent {
  selectedFileName: string= "File";
  selectedFile: File | null = null;
  fileNames: Map<number, string> | null = null;
  subject: string = "";
  branch: string = "";
  year: string = "";


  setYear(event: Event): void {
    this.year = (event.target as HTMLInputElement).value;
  }

  setSubject(event: Event): void {
    this.subject = (event.target as HTMLInputElement).value;
  }
  zweigSelectOptions = ['Informatik', 'Medientechnik', 'Elektronik', 'Medizintechnik'];

  lessonsSelectOptions: string[] = ['Programmieren', 'Mathe', 'DBI'];

  optionsMap: { [key: string]: string[] } = {
    Informatik:  ['Programmieren', 'Mathe', 'DBI'],
    Medientechnik: ['Graphic', 'Deutsch', 'Photoshop'],
    Medizintechnik: ['Verarzten', 'Englisch', 'Biologie'],
    Elektronik: ['Türkisch', 'Elektrik', 'Labor']
  };

  onFirstSelectChange(event: Event): void {
    this.branch = (event.target as HTMLSelectElement).value;
    this.lessonsSelectOptions = this.optionsMap[this.branch] || [];
  }
  constructor(private http: HttpClient, private apiService: ApiService) {
  }

  public async ngOnInit() {
    const url = this.apiService.getApiUrl('Notes');
    this.fileNames = await this.getFileNames()
    const list = document.getElementById('fileNameList');

    if (list) {
      list.innerHTML = '';
      for (const [id, name] of this.fileNames) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.textContent = name;
        a.id = `${id}`;
        a.href = `${url}/${id}`;

        const preview = document.createElement("p");
        preview.textContent = "preview";

        preview.addEventListener("click", () => {
          const embed = document.createElement("embed");
          embed.src = a.href;
          embed.type = "application/pdf";
          li.appendChild(embed);
        });

        li.appendChild(a);
        li.appendChild(preview);
        list.appendChild(li);
      }

    }
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
        console.error('Upload failed!', err);
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
