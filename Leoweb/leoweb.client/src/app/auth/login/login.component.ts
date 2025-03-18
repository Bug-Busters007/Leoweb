import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    imports: [
        FormsModule,
        RouterLink,
    ]
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('jwtToken', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('expiresAt', response.expiresAt);
        localStorage.setItem('userId', response.userId);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login fehlgeschlagen:', err);
      },
    });
  }
}
