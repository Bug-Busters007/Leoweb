import { Component, Input } from '@angular/core';
import {NgFor, NgIf} from "@angular/common";
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {HttpClient} from "@angular/common/http";
import {SharedService} from "../../../../services/share-name.service";
import {Spinner} from "../../spinner/spinner";
import {PollService} from "../../../../services/poll.service";
import {RefreshService} from "../../../../services/refresh.service";
import {SignalRService} from "../../../../services/chat.service";
import {BanService} from "../../../../services/ban.service";
import {IStudentBan} from "../../../../models/studentBanModel";

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
  @Input() id: number = 0;
  @Input() itemType: string = "";
  @Input() component?: string;
  @Input() responsibleStudentId?: string;

  constructor(private sharedService: SharedService, private pollService: PollService, private refreshService: RefreshService, private chatService: SignalRService, private banService: BanService) {
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

  async banUser() {
    console.log(`banning user: ${this.responsibleStudentId}`);
    const ban: IStudentBan = {reason: 'not implemented', userId: this.responsibleStudentId!, bannedIn: this.component!};
    this.banService.banStudent(ban).subscribe({
      next: () => {
        alert(`Successfully banned user ${this.responsibleStudentId}`);
      },
      error: (error) => {
        console.log(`Error while banning user`);
        console.log(error);
      }
    })
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
    console.log(`id: ${this.id}`);
    this.chatService.deleteMessage(this.id).subscribe({
      next: () => {
        alert(`Successfully deleted message ${this.id}`);
        this.refreshService.triggerRefresh();
      },
      error: (error) => {
        console.log(`Error while deleting message: ${error.message}`);
        console.log(error);
      }
    })
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
