import {Component, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet} from '@angular/router';
import {HeaderComponent} from "./components/header/header.component";
import {ModuleComponent} from "./components/module/module.component";
import {HomeComponent} from "./home/home.component";
import {FileDisplayComponent} from "./components/file-display/file-display.component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}
