import { Component } from '@angular/core';
import {Router, RouterLink, RouterModule, RouterOutlet} from "@angular/router";
import {routes} from "../../app.routes";

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router) {}
  navigateToLogin(): void {
    this.router.navigate(['/login']); // Navigiert zur Login-Seite
  }

  navigateToAccountSettings(): void{
    this.router.navigate(['/accountSettings']);
  }

  protected readonly localStorage = localStorage;
}
