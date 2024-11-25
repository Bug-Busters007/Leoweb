import { Component } from '@angular/core';

@Component({
  selector: 'app-leo-library',
  templateUrl: './leo-library.component.html',
  styleUrls: ['./leo-library.component.css'],
  standalone: true
})
export class LeoLibraryComponent {
  pdfSrc: string | null = null; // URL of the uploaded PDF

  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Prevent default behavior (e.g., open file in browser)
  }

  onDragEnter(): void {
    const dropArea = document.getElementById('drop-area');
    dropArea?.classList.add('hover');
  }

  onDragLeave(): void {
    const dropArea = document.getElementById('drop-area');
    dropArea?.classList.remove('hover');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const dropArea = document.getElementById('drop-area');
    dropArea?.classList.remove('hover');

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (file.type === 'application/pdf') {
        this.pdfSrc = URL.createObjectURL(file); // Create URL for the PDF
      } else {
        alert('Please upload a valid PDF file.');
      }
    }
  }
}
