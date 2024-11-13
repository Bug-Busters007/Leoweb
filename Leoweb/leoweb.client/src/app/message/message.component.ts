import { Component } from '@angular/core';
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  message : string = '';
  apiService : ApiService = new ApiService();

  constructor() {}

  ngOnInit() {
    this.getMessage();
  }

  async getMessage() {
    const resp = await this.apiService.getData();
    return resp;
  }

}
