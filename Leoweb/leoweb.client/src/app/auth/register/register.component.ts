import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {CommonModule} from "@angular/common";
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatLabel } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    imports: [
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      MatCard,
      MatCardTitle,
      MatCardContent,
      MatLabel,
      MatFormField,
      MatCheckbox,
      MatButtonModule,
      MatInputModule,
      RouterLink,
    ],
})
export class RegisterComponent {
  errorMessage: string = '';
  role: string = "";

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    isAdmin: new FormControl<boolean>(false),
  });

  constructor(private authService: AuthService, private router: Router) {}
  register(): void {
    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.form.value.isAdmin) {
      this.role = 'admin';
      console.log('registered as admin');
    }
    else {
      this.role = 'user';
      console.log('registered as user');
    }

    this.authService.register(this.form.value.email, this.form.value.password, this.role).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage = 'Registration failed. Please try again.';
      },
    });
  }

  checkedAdmin() {
    this.form.value.isAdmin = !this.form.value.isAdmin;
    console.log(`is admin: ${this.form.value.isAdmin}`);
  }
}
