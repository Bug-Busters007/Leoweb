import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../components/modal/modal.component';
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

  openPasswordModal(): void{
    this.dialog.open(ModalComponent, {
      width: '400px',
      data: {
        title: 'Change Password',
        content: `
            <div>
            <label for="currentPW">Aktuelles Passwort:</label>
            <input type="password" id="currentPW" placeholder="Aktuelles Passwort eingeben" />
            </div>
            <div>
            <label for="newPW">Neues Passwort:</label>
            <input type="password" id="newPW" placeholder="Neues Passwort eingeben" />
            </div>

            <div>
            <label for="confirmPW">Passwort bestätigen:</label>
            <input type="password" id="confirmPW" placeholder="Neues Passwort bestätigen" />
            </div>
        `
      }
    })
  }

  openEmailModal(): void{
    this.dialog.open(ModalComponent, {
      width: '400px',
      data: {
        title: 'Change Email',
        content: `
            <div>
            <label for="currentPW">Neue Email:</label>
            <input type="email" id="newEmail" placeholder="Neue Email eingeben" />
            </div>
            <div>
            <label for="newPW">Passwort:</label>
            <input type="password" id="PW" placeholder="Passwort eingeben" />
            </div>
        `
      }
    })
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
