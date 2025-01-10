import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule
  ],
  standalone: true
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  login() {
    console.log("du bist noch nicht eingeloggt");
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.authService.getUserData().subscribe({
          next: (userData) => {
            console.log('Eingeloggt als:', userData);
          },
          error: (error) => {
            console.error('Fehler beim Laden der Benutzerdaten:', error);
          }
        });
      },
      error: (error) => {
        console.error('Login fehlgeschlagen:', error);
      }
    });
  }
}
