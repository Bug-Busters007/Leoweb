import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  standalone: true,
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent {
  constructor(public dialog: MatDialog, private router : Router, private authService: AuthService) {}

  openModal(title: string, content: string): void {
    this.dialog.open(ModalComponent, {
      width: '400px',
      data: { title, content },
    });
  }

  logout() : void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('expiresAt');
    this.router.navigate(['/login']);
  }
  
  getUserData() : void {
    this.authService.getUserData().subscribe({
      next: (response) => {
        this.openModal('User Data', JSON.stringify(response));
      },
      error: (error) => {
        this.openModal('Error', 'Could not get user data');
      }
    });
  }
}
