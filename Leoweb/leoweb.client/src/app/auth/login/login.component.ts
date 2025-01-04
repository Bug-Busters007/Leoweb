import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {FormsModule} from "@angular/forms";
import {HttpClientModule, provideHttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    FormsModule,
    HttpClientModule,
  ],
  standalone: true
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => console.error('Login fehlgeschlagen:', err)
    });
  }
}
