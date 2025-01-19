import { Component } from '@angular/core';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css'],
  standalone: true
})
export class PdfViewerComponent {
  public static showPdf(url: string) {
    console.log('PdfViewerComponent.showPdf');

    // Modal Container
    const modalContainer = document.createElement('div');
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modalContainer.style.display = 'flex';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
    modalContainer.style.zIndex = '1000';
    document.body.appendChild(modalContainer);

    // PDF Embed Element
    const embedElement = document.createElement('embed');
    embedElement.style.width = '80%';
    embedElement.style.height = '80%';
    embedElement.style.borderRadius = '10px';
    embedElement.style.border = '2px solid orangered';
    embedElement.src = url;
    modalContainer.appendChild(embedElement);

    // Close Button
    const closeModalButton = document.createElement('button');
    closeModalButton.textContent = 'Close';
    closeModalButton.style.position = 'absolute';
    closeModalButton.style.top = '10px';
    closeModalButton.style.right = '10px';
    closeModalButton.style.padding = '5px 20px';
    closeModalButton.style.fontFamily = 'Consolas, sans-serif';
    closeModalButton.style.fontSize = '1.5rem';
    closeModalButton.style.cursor = 'pointer';
    closeModalButton.style.border = '2px solid orangered';
    closeModalButton.style.borderRadius = '10px';
    closeModalButton.style.backgroundColor = 'white';
    closeModalButton.style.color = 'orangered';
    closeModalButton.style.transition = 'background-color 0.3s, color 0.3s';

    // Hover effect for close button
    closeModalButton.onmouseover = () => {
      closeModalButton.style.backgroundColor = 'orangered';
      closeModalButton.style.color = 'white';
    };

    closeModalButton.onmouseout = () => {
      closeModalButton.style.backgroundColor = 'white';
      closeModalButton.style.color = 'orangered';
    };

    closeModalButton.onclick = () => {
      modalContainer.style.display = 'none';
    };
    modalContainer.appendChild(closeModalButton);
  }
}
