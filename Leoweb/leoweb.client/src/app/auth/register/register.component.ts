import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  isAdmin: boolean = true;
  role: string = "";

  constructor(private authService: AuthService, private router: Router) {}
  register(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.isAdmin) {
      this.role = 'admin';
      console.log('registered as admin');
    }
    else {
      this.role = 'user';
      console.log('registered as user');
    }

    this.authService.register(this.email, this.password, this.role).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage = 'Registration failed. Please try again.';
      },
    });
  }

  checkedAdmin() {
    this.isAdmin = !this.isAdmin;
    console.log(`is admin: ${this.isAdmin}`);
  }
}
