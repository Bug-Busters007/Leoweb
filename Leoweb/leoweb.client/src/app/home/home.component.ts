import { Component } from '@angular/core';
import {ModuleComponent} from "../components/module/module.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [
    ModuleComponent
  ]
})
export class HomeComponent {

}
