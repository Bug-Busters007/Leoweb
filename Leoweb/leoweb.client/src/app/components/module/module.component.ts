import {Component, input, signal} from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrl: './module.component.css',
  standalone: true,
  imports: [
    RouterLink
  ]
})
export class ModuleComponent {
  title = input("Title");
  description = input("Description");
  links = input("/home")
}
