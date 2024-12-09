import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // HttpClientModule importieren
import { RouterLink } from '@angular/router';
import {AsyncPipe, KeyValuePipe} from "@angular/common";

@Component({
  selector: 'app-leo-library',
  templateUrl: './leo-library.component.html',
  styleUrls: ['./leo-library.component.css'],
  standalone: true,
  imports: [RouterLink, HttpClientModule, AsyncPipe, KeyValuePipe]
})
export class LeoLibraryComponent {
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log("file selected")
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.selectedFile) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('https://localhost:7008/api/notes', formData).subscribe({
      next: (response) => {
        console.log('Upload successful!', response);
      },
      error: (err) => {
        console.error('Upload failed!', err);
      },
    });
  }


  async fileNames(): Promise<Map<number, string>> {
    const fileNames: { id: number; name: string }[] | undefined = await this.http
      .get<{ id: number; name: string }[]>('https://localhost:7008/api/allFileNames')
      .toPromise();
    const result = new Map<number, string>();
    if (fileNames !== undefined) {
      fileNames.forEach(file => {
        result.set(file.id, file.name);
      });
    }
    return result;
    // https://localhost:7008/notes/:id
    //wenn man das eingibt, wird die datei heruntergeladen
  }

  files = this.fileNames();
  //files is de map mit den ids und den dateinamen

}
