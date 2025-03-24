import { Component } from '@angular/core';
import {BanListComponent} from "../../ban-list/ban-list.component";

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [
    BanListComponent
  ],
  templateUrl: './admin-overview.component.html',
  styleUrl: './admin-overview.component.css'
})
export class AdminOverviewComponent {

}
