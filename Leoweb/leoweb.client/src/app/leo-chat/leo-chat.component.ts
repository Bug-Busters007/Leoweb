import { Component, OnInit } from "@angular/core";
import { ChatService } from "../../services/chat.service";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
@Component({
  selector: "app-chat",
  templateUrl: "./leo-chat.component.html",
  standalone: true,
  styleUrls: ["./leo-chat.component.css"],
  imports: [
    NgForOf,
    FormsModule,
  ]
})
export class LeoChatComponent implements OnInit {
  messages: { sender: string; message: string }[] = [];
  newMessage = "";
  userName = "User"

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.startConnection();

    this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
    });

    this.chatService.getChatHistory().subscribe(history => {
      this.messages = [...history, ...this.messages];
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.userName, this.newMessage);
      this.newMessage = "";
    }
  }
}
