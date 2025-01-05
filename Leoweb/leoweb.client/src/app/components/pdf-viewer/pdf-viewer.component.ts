import { Component} from '@angular/core';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css'],
  standalone: true
})
export class PdfViewerComponent {
  isVisible: boolean = false;
  pdfSrc: string = 'assets/sample.pdf';

  showPdf() {
    this.isVisible = true;
  }
}
