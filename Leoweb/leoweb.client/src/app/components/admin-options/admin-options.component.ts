import { Component, Input } from '@angular/core';
import {NgFor, NgIf} from "@angular/common";
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {HttpClient} from "@angular/common/http";
import {SharedService} from "../../../services/share-name.service";

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
  @Input() id: number = 0;

  constructor(private sharedService: SharedService) {
  }
  deleteItem() {
    console.log(`id: ${this.id}`);
    this.sharedService.deleteFile(this.id).subscribe({
      next: () => {
        alert(`Successfully deleted file ${this.id}`);
      },
      error: (error) => {
        console.log(`Fehler beim löschen der Datei: ${error.message}`);
        console.log(error);
      }
    });
  }

  banUser() {
    alert('User gebannt!');
  }
}
