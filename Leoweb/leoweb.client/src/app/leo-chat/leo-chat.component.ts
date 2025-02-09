import { Component, OnInit } from "@angular/core";
import { ChatService } from "../../services/chat.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-chat",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./leo-chat.component.html",
  styleUrls: ["./leo-chat.component.css"],
})
export class LeoChatComponent implements OnInit {
  userId = "user1";
  selectedUser = "";
  message = "";
  messages: { sender: string; message: string }[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.startConnection(this.userId);
    this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
    });
  }

  selectUser(user: string) {
    this.selectedUser = user;
    this.chatService.getChatHistory(this.userId, user).subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage() {
    if (this.selectedUser && this.message) {
      this.chatService.sendMessage(this.userId, this.selectedUser, this.message);
      this.message = "";
    }
  }
}
