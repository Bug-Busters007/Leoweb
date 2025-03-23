import { SignalRService } from '../../services/chat.service';
import { NgForOf, NgClass } from '@angular/common';
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import {Component, OnInit, ViewChild, ElementRef, AfterViewChecked, Input} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { SharedService } from "../../services/share-name.service";
import { MatRippleModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { trigger, transition, style, animate } from '@angular/animations';
import {AdminOptionsComponent} from "../components/admin/admin-options/admin-options.component";
import {AuthService} from "../../services/auth.service";
import {ApiService} from "../../services/api.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-chat',
  templateUrl: './leo-chat.component.html',
  styleUrls: ['./leo-chat.component.css'],
  standalone: true,
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  imports: [
    NgForOf,
    FormsModule,
    NgClass,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatBadgeModule,
    MatDividerModule,
    AdminOptionsComponent
  ]
})
export class LeoChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages') private chatMessagesContainer: ElementRef | undefined;

  user = localStorage.getItem('userId');
  username = localStorage.getItem('username');
  message = '';
  messages: { user: string; message: string; timestamp?: Date, id: number }[] = [];
  isTyping = false;
  isAdmin!: boolean;
  role!: string;

  constructor(private signalRService: SignalRService, private router: Router, private sharedService: SharedService, private authService: AuthService, private http: HttpClient, private apiService: ApiService) {}

  private async getStudentsNames(messsages: { user: string; message: string; timestamp?: Date, id: number }[]): Promise<{ user: string; message: string; timestamp?: Date, id: number }[]> {
    const newMessages: { user: string; message: string; timestamp?: Date, id: number }[]= [];
    for (const message of messsages) {
      const userId: string = message.user;
      const studentName = await this.getStudentName(this.http, this.apiService, userId)
      if (studentName) {
        const params={
          user: studentName.email,
          message: message.message,
          timestamp: message.timestamp,
          id: message.id,
        }
        newMessages.push(params);
      }
    }

    return newMessages;
  }

  private async getStudentName(http: HttpClient, apiService: ApiService, userId: string): Promise<{ email: string } | undefined> {
    try {
      const url = apiService.getApiUrl(`chat/${userId}/email`);
      const response = await http.get<{ email: string }>(url).toPromise();
      return response;
    } catch (error) {
      return undefined;
    }
  }
  async ngOnInit() {
    const rawMessages: { user: string; message: string; timestamp?: Date, id: number }[] = [];
    this.signalRService.getInitialMessages().then(async (messages) => {
      if (messages && messages.length > 0) {
        for (let i = 0; i < messages.length; i++) {
          rawMessages.push({
            user: messages[i].studentName,
            message: messages[i].message,
            timestamp: new Date(messages[i].timestamp || Date.now()),
            id: messages[i].id
          });
        }
        this.messages = await this.getStudentsNames(rawMessages);

        setTimeout(() => this.scrollToBottom(), 100);

        this.authService.getUserData().subscribe((data) => {
          this.role = data.role;
          this.isAdmin = this.role === "admin";
          console.log(`User is admin: ${this.isAdmin}`);
        });
      } else {
        console.log('No messages');
      }
    });

    this.signalRService.getMessages().subscribe((msg) => {
      const msgWithTimestamp = {
        ...msg,
        timestamp: new Date()
      };
      this.messages.push(msgWithTimestamp);
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }


  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatMessagesContainer!.nativeElement.scrollTop =
        this.chatMessagesContainer!.nativeElement.scrollHeight;
    } catch(err) {
      console.error('Error scrolling to bottom', err);
    }
  }

  sendMessage() {
    if (this.message.trim() && this.user) {
      this.signalRService.sendMessage(this.user, this.message);
      this.message = '';
      const inputElement = document.querySelector('input[matInput]') as HTMLElement;
      if (inputElement) {
        (inputElement as HTMLElement).focus();
      }
    }
  }

  onTyping() {
    this.isTyping = this.message.trim().length > 0;
  }

  navigateUser(user: string) {
    if (user === this.user) {
      this.router.navigate(['/accountSettings']);
    } else {
      this.sharedService.setfromWhere('/leochat');
      this.sharedService.setInputValue(user);
      this.router.navigate(['/UserOverview']);
    }
  }

  getTimeString(timestamp?: Date): string {
    if (!timestamp) return '';
    return timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  isConsecutiveMessage(index: number): boolean {
    if (index === 0) return false;
    return this.messages[index].user === this.messages[index-1].user;
  }
}
