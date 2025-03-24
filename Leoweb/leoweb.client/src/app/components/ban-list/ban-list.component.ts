import { Component } from '@angular/core';
import {BanComponent} from "../ban/ban.component";

@Component({
  selector: 'app-ban-list',
  standalone: true,

  templateUrl: './ban-list.component.html',
  styleUrl: './ban-list.component.css',
  imports: [
    BanComponent
  ]
})
export class BanListComponent {

}
