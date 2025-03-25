import { Component, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {NgIf} from "@angular/common";
import {IStudentBan} from "../../../models/studentBanModel";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-ban',
  templateUrl: './ban.component.html',
  styleUrls: ['./ban.component.css'],
  imports: [MatCardModule, NgIf, MatButtonModule,MatIconModule],
  standalone: true
})
export class BanComponent implements IStudentBan{
  @Input() studentId!: string;
  @Input() bannedIn!: string;
  @Input() reason!: string;

  user: string = 'testUser';

  isExpanded = false;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  deleteBan(event: Event) {
    event.stopPropagation();
    console.log(`Ban for ${this.studentId} deleted.`);
  }
}
