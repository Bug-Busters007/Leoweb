import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../components/modal/modal.component';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {FileDisplayComponent} from "../components/file-display/file-display.component";
import {NgForOf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../services/api.service";
import {Spinner} from "../components/spinner/spinner";

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  standalone: true,
  imports: [
    FileDisplayComponent,
    NgForOf
  ],
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent {
  fileArray: { id: number; name: string; year: number, subject: string }[] = [];
  username = localStorage.getItem('username');
  constructor(public dialog: MatDialog, private router : Router, private authService: AuthService, private http: HttpClient, private apiService: ApiService) {}


  async ngOnInit() {
    const spinner: Spinner = new Spinner(document.getElementById('filesListed'));
    spinner.showSpinner();
    this.fileArray = await this.getFileNamesFromStudent();
    spinner.removeSpinner();
  }
  openModal(title: string, content: string): void {
    this.dialog.open(ModalComponent, {
      width: '400px',
      data: { title, content, showSubmitButton: false }
    });
  }

  openPasswordModal(): void{
    this.dialog.open(ModalComponent, {
      width: '400px',
      data: {
        title: 'Change Password',
        content: `
            <div>
            <label for="currentPW">Current password:</label>
            <input type="password" id="currentPW" placeholder="Enter current password" />
            </div>
            <div>
            <label for="newPW">New password:</label>
            <input type="password" id="newPW" placeholder="Enter new password" />
            </div>

            <div>
            <label for="confirmPW">Confirm new password:</label>
            <input type="password" id="confirmPW" placeholder="Enter new password" />
            </div>
        `,
        onSubmit: (email: string, oldPw: string, newPw: string, newPwCheck: string)=> this.changePassword(email, oldPw, newPw, newPwCheck),
        showSubmitButton: true
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
            <label for="newEmail">New email:</label>
            <input type="email" id="newEmail" placeholder="Enter new email" />
            </div>
            <div>
            <label for="password">Password:</label>
            <input type="password" id="password" placeholder="Enter password" />
            </div>
        `,
        showSubmitButton: true,
        onSubmit: (newEmail: string, oldEmail: string, password: string): void => this.changeEmail(newEmail, oldEmail, password)
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

  public async getFileNamesFromStudent(): Promise<{id: number, name: string, year: number, subject : string}[]> {
    const url = this.apiService.getApiUrl('Notes/allFilenamesFromStudent');
    console.log(url);
    try {
      const response: { id: number; name: string; year: number; subject: string }[] | undefined = await this.http
        .get<{ id: number; name: string; year: number; subject: string}[]>(url)
        .toPromise();
      if (response) {
        return response;
      }
    } catch (error) {
      console.error('Error fetching file names:', error);
      throw new Error('Failed to fetch file names');
    }
    return[];
  }

  changePassword(email: string, oldPw: string, newPw: string, newPwCheck: string): void{
    if(newPw !== newPwCheck || newPw !== newPwCheck){
      return;
    }
    this.authService.changePassword(email, oldPw, newPw).subscribe({
      next: (response) => {
        console.log('Erfolgreich aktualisiert', JSON.stringify(response));
      },
      error: (error) => {
        console.log('Error', 'Aktualisierung fehlgeschlagen');
      }
    });
  }

  changeEmail(newEmail: string, oldEmail: string, password: string): void{
    this.authService.changeEmail(newEmail, oldEmail, password).subscribe({
      next: (response) => {
        console.log('Erfolgreich aktualisiert', JSON.stringify(response));
      },
      error: (error) => {
        console.log('Error', 'Aktualisierung fehlgeschlagen');
      }
    })
  }

  protected readonly localStorage = localStorage;
}
