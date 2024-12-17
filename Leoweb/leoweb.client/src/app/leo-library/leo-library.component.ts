import { Component } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {PdfViewerComponent} from "../components/pdf-viewer/pdf-viewer.component";
import {timeout} from "rxjs";
import {toNumbers} from "@angular/compiler-cli/src/version_helpers";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-leo-library',
  templateUrl: './leo-library.component.html',
  styleUrls: ['./leo-library.component.css'],
  standalone: true,
  imports: [
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
HttpClientModule, PdfViewerComponent]
})
export class LeoLibraryComponent {
  selectedFile: File | null = null;
  fileNames: Map<number, string> | null = null;
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
        a.id = `${id}`
        a.href = `${url}/${id}`;
        li.appendChild(a);
        list.appendChild(li);
      }
    }
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log("file selected")
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
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

    this.http.post(`${url}/`, formData).subscribe({
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
