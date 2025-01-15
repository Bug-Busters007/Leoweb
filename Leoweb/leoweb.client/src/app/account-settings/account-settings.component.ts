import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-account-settings',
  template: `
    <button mat-button (click)="openModal('Modal 1', 'Inhalt von Modal 1')">Change Email</button>
    <button mat-button (click)="openModal('Modal 2', 'Inhalt von Modal 2')">Change Password</button>
  `,
  standalone: true,
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent {
  constructor(public dialog: MatDialog) {}

  openModal(title: string, content: string): void {
    this.dialog.open(ModalComponent, {
      width: '400px',
      data: { title, content },
    });
  }
}
