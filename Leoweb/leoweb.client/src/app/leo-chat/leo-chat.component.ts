import { SignalRService } from '../../services/chat.service';
import { NgForOf, NgClass } from '@angular/common';
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import {Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importiere FormsModule
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {Q} from "@angular/cdk/keycodes";


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
export class LeoChatComponent implements OnInit {
    user = localStorage.getItem('username');
    message = '';
    messages: { user: string; message: string }[] = [];

    constructor(private signalRService: SignalRService) {}

   async ngOnInit() {
       this.signalRService.getInitialMessages().then((messages) => {
         if(messages){
           for(let i = 0; i < messages.length; i++){
              this.messages.push({
                user: messages[i].studentName,
                message: messages[i].message
              });
            }
         }else{
           console.log('No messages');
         }
       });
        this.signalRService.getMessages().subscribe((msg) => {
            this.messages.push(msg);
        });
    }

    sendMessage() {
      console.log(this.messages);
        if (this.message.trim() && this.user) {
            this.signalRService.sendMessage(this.user, this.message);
            this.message = '';
        }
    }
}
