import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: "root"
})
export class ChatService {
  private hubConnection!: signalR.HubConnection;
  private messages = new BehaviorSubject<{ sender: string; message: string }[]>([]);
  messages$ = this.messages.asObservable();

  constructor(private http: HttpClient, private apiService: ApiService) {}

  startConnection(userId: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`http://127.0.0.1:4200/chathub?userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log("SignalR verbunden"))
      .catch(err => console.error("Verbindung fehlgeschlagen: ", err));

    this.hubConnection.on("ReceiveMessage", (sender: string, message: string) => {
      this.messages.next([...this.messages.getValue(), { sender, message }]);
    });
  }

  sendMessage(sender: string, receiver: string, message: string) {
    this.hubConnection.invoke("SendMessage", sender, receiver, message)
      .catch(err => console.error(err));
  }

  getChatHistory(user1: string, user2: string) {
    return this.http.get<{ sender: string; message: string }[]>(`http://127.0.0.1:4200/api/chat/${user1}/${user2}`);
  }
}
