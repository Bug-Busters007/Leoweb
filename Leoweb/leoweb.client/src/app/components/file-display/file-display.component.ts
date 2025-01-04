import {Component, Input} from '@angular/core';
import {ApiService} from "../../../services/api.service";

@Component({
  selector: 'app-file-display',
  templateUrl: './file-display.component.html',
  styleUrl: './file-display.component.css',
  standalone: true,
})
export class FileDisplayComponent {
  constructor(private apiService: ApiService) {
  }
  @Input() id: number = 0;
  @Input() name: string = "File";
  url = this.apiService.getApiUrl('Notes');


  navigateToFile(): void {
    const fileUrl = `${this.url}/${this.id}`;
    window.location.href = fileUrl;
  }

}

