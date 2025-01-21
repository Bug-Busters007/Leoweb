import {AfterViewInit, Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-modal',
  imports: [CommonModule, FormsModule],
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.css'
})
export class ModalComponent implements AfterViewInit {
  sanitizedContent: SafeHtml;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {
    this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(data.content);
  }

  ngAfterViewInit(): void{
    if(!this.data.showSubmitButton){
      const btn = document.getElementById('submitBtn');
      if(btn){
        btn.hidden = true;
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void{
    const email: string | null = localStorage.getItem('username');
    const title: string = document.getElementById('title')!.innerText;
    if(title === 'Change Password'){
      this.data.onSubmit(email, (document.getElementById('currentPW') as HTMLInputElement).value, (document.getElementById('newPW') as HTMLInputElement).value, (document.getElementById('confirmPW') as HTMLInputElement).value);
    }else if(title === 'Change Email'){
      console.log('Email');
    }
    this.close();
  }
}
