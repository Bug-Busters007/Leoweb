import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";
import {RefreshService} from "./refresh.service";

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  private messageSubject = new Subject<{ user: string; message: string, id: number }>();

  constructor(private apiService: ApiService, private http: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5171/chatHub', {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

    this.hubConnection.start().catch(err => console.error('SignalR Error:', err));

    this.hubConnection.on('ReceiveMessage', (user: string, message: string, id: number) => {
      this.messageSubject.next({ user, message, id });
    });
    this.getInitialMessages();
  }
  sendMessage(user: string, message: string) {
    this.hubConnection.invoke('SendMessage', user, message)
      .then(() => console.log('Message sent successfully'))
      .catch(err => console.error(err));
  }

  getMessages(): Observable<{ user: string; message: string, id: number}> {
    return this.messageSubject.asObservable();
  }

  async getInitialMessages() : Promise<{ id : number, studentName : string,message : string; timestamp: string }[] | undefined> {
     const url = this.apiService.getApiUrl('chat/messages');
      try {
        const response = await this.http
          .get<{ id : number, studentName : string,message : string; timestamp: string }[]>(url)
          .toPromise();
        if (response) {
          return response;
        }
      } catch (error) {
        console.error('Error getting all messages', error);
      }
      return undefined;
  }

  deleteMessage(id: number): Observable<void> {
    const url = this.apiService.getApiUrl('chat/messages');
    return this.http.delete<void>(`${url}/${id}`);
  }
}
