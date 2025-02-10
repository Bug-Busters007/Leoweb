import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';

@Component({
    selector: 'app-chat',
    templateUrl: './leo-chat.component.html',
    styleUrls: ['./leo-chat.component.css'],
    standalone: true,
    imports:[
        NgForOf,
        FormsModule,
    ]
})
export class LeoChatComponent implements OnInit {
    user = 'User' + Math.floor(Math.random() * 1000);
    message = '';
    messages: { user: string; message: string }[] = [];

    constructor(private signalRService: SignalRService) {}

    ngOnInit(): void {
        this.signalRService.getMessages().subscribe((msg) => {
            this.messages.push(msg);
        });
    }

    sendMessage() {
        if (this.message.trim()) {
            this.signalRService.sendMessage(this.user, this.message);
            this.message = '';
        }
    }
}
