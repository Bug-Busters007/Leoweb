import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // HttpClientModule importieren

@Component({
  selector: 'app-leo-library',
  templateUrl: './leo-library.component.html',
  styleUrls: ['./leo-library.component.css'],
  standalone: true,
  imports: [HttpClientModule]
})
export class LeoLibraryComponent {
  selectedFile: File | null = null;
  fileNames: Map<number, string> | null = null;
  constructor(private http: HttpClient) {
  }

  public async ngOnInit() {
    this.fileNames = await this.getFileNames();
    const list = document.getElementById("fileNameList");

    if (list) {
      for (const [id, name] of this.fileNames) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `https://localhost:7008/api/Notes/${id}`;
        a.textContent = name;
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
        .toPromise(); // Konvertiert Observable in Promise (RxJS <7)

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
