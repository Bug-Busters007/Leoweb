import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
    selector: 'app-modal',
    imports: [CommonModule],
    template: `
      <div class="modal-overlay">
        <div class="modal-container">
          <h2 class="modal-title">{{ data.title }}</h2>
          <form class="modal-content" [innerHTML]="sanitizedContent"></form>
          <div class="modal-actions">
            <button class="modal-button close-button" (click)="close()">Schließen</button>
          </div>
        </div>
      </div>

    `,
    styleUrl: './modal.component.css'
})
export class ModalComponent {
  sanitizedContent: SafeHtml;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {
    this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(data.content);
  }

  close(): void {
    this.dialogRef.close();
  }
}
