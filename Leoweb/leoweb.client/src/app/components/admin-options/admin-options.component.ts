import { Component, Input } from '@angular/core';
import {NgFor, NgIf} from "@angular/common";
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-options',
  templateUrl: './admin-options.component.html',
  styleUrl: './admin-options.component.css',
  standalone: true,
  imports: [
    NgIf,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
    ]
})
export class AdminOptionsComponent {
  @Input() isUser = false;
  deleteItem() {
    alert('Element gelöscht!');
  }

  banUser() {
    alert('User gebannt!');
  }
}
