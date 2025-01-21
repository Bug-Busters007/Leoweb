export class Spinner {
  spinner: HTMLDivElement;
  htmlElement: HTMLElement;

  constructor(htmlElement: HTMLElement | null) {
    if (htmlElement == null) {
      throw new Error('htmlElement not found');
    }
    this.htmlElement = htmlElement;

    const computedStyle = window.getComputedStyle(this.htmlElement);
    if (computedStyle.position === 'static') {
      this.htmlElement.style.position = 'relative';
    }

    this.spinner = document.createElement('div');
    this.spinner.style.position = 'absolute';
    this.spinner.style.top = '50%';
    this.spinner.style.left = '50%';
    this.spinner.style.transform = 'translate(-50%, -50%)';
    this.spinner.style.border = '8px solid #f3f3f3';
    this.spinner.style.borderTop = '8px solid #3498db';
    this.spinner.style.borderRadius = '50%';
    this.spinner.style.width = '50px';
    this.spinner.style.height = '50px';
    this.spinner.style.animation = 'spin 1s linear infinite';

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  public showSpinner() {
    this.htmlElement.appendChild(this.spinner);
  }

  public removeSpinner() {
    this.htmlElement.removeChild(this.spinner);
  }
}
