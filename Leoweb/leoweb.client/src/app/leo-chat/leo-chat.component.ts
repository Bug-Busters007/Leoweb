import { SignalRService } from '../../services/chat.service';
import { NgForOf, NgClass } from '@angular/common';
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importiere FormsModule
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-chat',
    templateUrl: './leo-chat.component.html',
    styleUrls: ['./leo-chat.component.css'],
    standalone: true,
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
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule
    ]
})
export class LeoChatComponent {
    user = localStorage.getItem('username');
    message = '';
    messages: { user: string; message: string }[] = [];

    constructor(private signalRService: SignalRService) {}

    ngOnInit(): void {
        this.signalRService.getMessages().subscribe((msg) => {
            this.messages.push(msg);
        });
    }

    sendMessage() {
        if (this.message.trim() && this.user) {
            this.signalRService.sendMessage(this.user, this.message);
            this.message = '';
        }
    }
}
