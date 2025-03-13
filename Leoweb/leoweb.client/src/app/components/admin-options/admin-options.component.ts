import { Component, Input } from '@angular/core';
import {NgFor, NgIf} from "@angular/common";

@Component({
  selector: 'app-admin-options',
  templateUrl: './admin-options.component.html',
  styleUrl: './admin-options.component.css',
  standalone: true,
  imports: [
    NgIf,

    ]
})
export class AdminOptionsComponent {
  @Input() isUser = false;
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  deleteItem() {
    alert('Element gelöscht!');
  }

  banUser() {
    alert('User gebannt!');
  }
}
