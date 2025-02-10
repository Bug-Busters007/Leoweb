import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ChatService {
  private hubConnection!: signalR.HubConnection;
  private messages = new BehaviorSubject<{ sender: string; message: string }[]>([]);
  messages$ = this.messages.asObservable();

  constructor(private http: HttpClient) {
  }




  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5171/api/chathub", {
        withCredentials: false
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log("SignalR verbunden");
      })
      .catch(err => {
        console.error("Verbindung fehlgeschlagen: ", err);
        setTimeout(() => this.startConnection(), 5000); // 🔥 Automatischer Reconnect nach 5s
      });


    this.hubConnection.on("ReceiveMessage", (sender: string, message: string) => {
      this.messages.next([...this.messages.getValue(), { sender, message }]);
    });
  }

  sendMessage(sender: string, message: string) {
    this.hubConnection.invoke("SendMessage", sender, message)
      .catch(err => console.error(err));
  }

  getChatHistory() {
    return this.http.get<{ sender: string; message: string }[]>("http://localhost:5171/api/chat");
  }
}
