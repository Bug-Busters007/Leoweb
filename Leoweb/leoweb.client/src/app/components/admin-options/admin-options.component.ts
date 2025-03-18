import { Component, Input } from '@angular/core';
import {NgFor, NgIf} from "@angular/common";
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {HttpClient} from "@angular/common/http";
import {SharedService} from "../../../services/share-name.service";
import {Spinner} from "../spinner/spinner";
import {PollService} from "../../../services/poll.service";
import {RefreshService} from "../../../services/refresh.service";

@Component({
  selector: 'app-admin-options',
  templateUrl: './admin-options.component.html',
  styleUrl: './admin-options.component.css',
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule
    ]
})
export class AdminOptionsComponent {
  @Input() isUser = false;
  @Input() id: number = 0;
  @Input() itemType: string = "";

  constructor(private sharedService: SharedService, private pollService: PollService, private refreshService: RefreshService) {
  }
  deleteItem() {
    if (this.itemType == "file") {
      this.deleteFile();
    }
    else if (this.itemType == "message") {
      this.deleteMessage();
    }
    else if (this.itemType == "poll") {
      this.deletePoll();
    }
  }

  banUser() {
    alert('User gebannt!');
  }

  deleteFile() {
    console.log(`id: ${this.id}`);
    this.sharedService.deleteFile(this.id).subscribe({
      next: () => {
        alert(`Successfully deleted file ${this.id}`);
        this.refreshService.triggerRefresh();
      },
      error: (error) => {
        console.log(`Error while deleting file: ${error.message}`);
        console.log(error);
      }
    });
  }

  deleteMessage() {
    console.log('delete message');
  }

  deletePoll() {
    console.log('delete poll');
    this.pollService.deletePoll(this.id).subscribe({
      next: () => {
        alert(`Successfully deleted poll ${this.id}`);
        this.refreshService.triggerRefresh();
      },
      error: (error) => {
        console.log(`Error while deleting poll: ${error.message}`);
        console.log(error);
      }
    })
  }
}
