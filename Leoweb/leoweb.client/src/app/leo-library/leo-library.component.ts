import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {PdfViewerComponent} from "../components/pdf-viewer/pdf-viewer.component";
import {timeout} from "rxjs";
import {toNumbers} from "@angular/compiler-cli/src/version_helpers"; // HttpClientModule importieren

@Component({
  selector: 'app-leo-library',
  templateUrl: './leo-library.component.html',
  styleUrls: ['./leo-library.component.css'],
  standalone: true,
  imports: [HttpClientModule, PdfViewerComponent]
})
export class LeoLibraryComponent {
  selectedFile: File | null = null;
  fileNames: Map<number, string> | null = null;
  constructor(private http: HttpClient) {
  }

  public clickHandlerPdf(id: number): void {
    /*
    es geht noch nicht dass bei gleichen dateien bei beiden der download angezeigt wird
    */
    const li: HTMLElement | null = document.getElementById(`file-${id}`)
    if (li) {
      if (li.children.length > 0) {
        return;
      }
      const downloadButton = document.createElement("a");
      downloadButton.textContent = "Download";
      downloadButton.href = `https://localhost:7008/api/Notes/${id}`;
      li.appendChild(downloadButton)
    }
  }

  public async ngOnInit() {
    this.fileNames = await this.getFileNames();
    const list = document.getElementById("fileNameList");

    if (list) {
      for (const [id, name] of this.fileNames) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.textContent = name;
        a.id = `file-${id}`
        a.onclick = () => {this.clickHandlerPdf(id)}
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
    event.preventDefault();

    if (!this.selectedFile) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('https://localhost:7008/api/Notes/', formData).subscribe({
      next: (response) => {
        console.log('Upload successful!', response);
      },
      error: (err) => {
        console.error('Upload failed!', err);
      },
    });
  }

  public async getFileNames(): Promise<Map<number, string>> {
    try {
      const response: { id: number; name: string }[] | undefined = await this.http
        .get<{ id: number; name: string }[]>('https://localhost:7008/api/Notes/allFileNames')
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
