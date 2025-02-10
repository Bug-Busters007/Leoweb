import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  private messageSubject = new Subject<{ user: string; message: string }>();

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5171/chatHub', {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

    this.hubConnection.start().catch(err => console.error('SignalR Error:', err));

    this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
      this.messageSubject.next({ user, message });
    });
  }

  sendMessage(user: string, message: string) {
    this.hubConnection.invoke('SendMessage', user, message).catch(err => console.error(err));
  }

  getMessages(): Observable<{ user: string; message: string }> {
    return this.messageSubject.asObservable();
  }
}
