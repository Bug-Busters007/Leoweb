import { SignalRService } from '../../services/chat.service';
import { NgForOf, NgClass } from '@angular/common';
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
  imports:[
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
    MatDividerModule
  ]
})
export class LeoChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages') private chatMessagesContainer: ElementRef | undefined;

  user = localStorage.getItem('username');
  message = '';
  messages: { user: string; message: string; timestamp?: Date }[] = [];
  isTyping = false;

  constructor(private signalRService: SignalRService, private router: Router, private sharedService: SharedService) {}

  async ngOnInit() {
    this.signalRService.getInitialMessages().then((messages) => {
      if(messages && messages.length > 0){
        for(let i = 0; i < messages.length; i++){
          this.messages.push({
            user: messages[i].studentName,
            message: messages[i].message,
            timestamp: new Date(messages[i].timestamp || Date.now())
          });
        }
        // Sort messages by timestamp if available
        this.messages.sort((a, b) => {
          return (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0);
        });
        setTimeout(() => this.scrollToBottom(), 100);
      }else{
        console.log('No messages');
      }
    });
    this.signalRService.getMessages().subscribe((msg) => {
      // Add timestamp to new messages
      const msgWithTimestamp = {
        ...msg,
        timestamp: new Date()
      };
      this.messages.push(msgWithTimestamp);
      // Auto-scroll on new message
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  ngAfterViewChecked() {
    // This ensures we scroll to bottom after view updates
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
      // Focus back on input after sending
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
