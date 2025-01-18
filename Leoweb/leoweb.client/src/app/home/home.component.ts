import { Component } from '@angular/core';
import {ModuleComponent} from "../components/module/module.component";
import {RouterLink} from "@angular/router";
import {HeaderComponent} from "../components/header/header.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [
    ModuleComponent,
    RouterLink,
    HeaderComponent
  ]
})
export class HomeComponent {
}
