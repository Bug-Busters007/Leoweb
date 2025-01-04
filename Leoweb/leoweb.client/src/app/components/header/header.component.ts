import { Component } from '@angular/core';
import {Router, RouterLink, RouterModule, RouterOutlet} from "@angular/router";
import {routes} from "../../app.routes";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router) {}
  navigateToLogin(): void {
    this.router.navigate(['/login']); // Navigiert zur Login-Seite
  }
}
