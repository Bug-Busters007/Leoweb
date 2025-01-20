import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
    selector: 'app-modal',
    imports: [CommonModule],
    templateUrl: './modal.component.html',
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

  submit(): void{
    const email: string | null = localStorage.getItem('username');
    this.data.onSubmit(email, (document.getElementById('currentPW') as HTMLInputElement).value, (document.getElementById('newPW') as HTMLInputElement).value, (document.getElementById('confirmPW') as HTMLInputElement).value);
    this.close();
  }
}
