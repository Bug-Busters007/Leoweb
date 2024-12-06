import { Component } from '@angular/core';
import {ModuleComponent} from "../components/module/module.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [
    ModuleComponent,
    RouterLink
  ]
})
export class HomeComponent {
}
