import { Component, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-ban',
  templateUrl: './ban.component.html',
  styleUrls: ['./ban.component.css'],
  imports: [MatCardModule, NgIf, MatButtonModule],
  standalone: true
})
export class BanComponent {
  @Input() user!: string;
  @Input() bannedIn!: string;
  @Input() reason!: string;

  isExpanded = false;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  deleteBan(event: Event) {
    event.stopPropagation(); // Prevent card click from toggling
    console.log(`Ban for ${this.user} deleted.`);
    // Implement deletion logic here
  }
}
