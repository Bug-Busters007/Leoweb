import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    imports: [
      FormsModule,
      RouterLink,
      MatButtonModule,
      MatFormField,
      MatInputModule,
      MatCard,
      MatCardTitle,
      MatCardContent,
      ReactiveFormsModule,
    ]
})
export class LoginComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.form.value.email, this.form.value.password).subscribe({
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
