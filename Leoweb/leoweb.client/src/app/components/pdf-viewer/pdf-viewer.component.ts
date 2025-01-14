import { Component} from '@angular/core';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css'],
  standalone: true
})
export class PdfViewerComponent {
  public static showPdf(url: string) {
    console.log('PdfViewerComponent.showPdf');
    const modalContainer = document.createElement('div');
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalContainer.style.display = 'flex';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
    modalContainer.style.zIndex = '1000';
    document.body.appendChild(modalContainer);

    const embedElement = document.createElement('embed');
    embedElement.style.width = '80%';
    embedElement.style.height = '80%';
    embedElement.src = url;
    modalContainer.appendChild(embedElement);

    const closeModalButton = document.createElement('button');
    closeModalButton.textContent = 'Close';
    closeModalButton.style.position = 'absolute';
    closeModalButton.style.top = '10px';
    closeModalButton.style.right = '10px';
    closeModalButton.onclick = () => {
      modalContainer.style.display = 'none';
    };
    modalContainer.appendChild(closeModalButton);
  }
}
