import {Component, input} from '@angular/core';

@Component({
  selector: 'app-file-display',
  templateUrl: './file-display.component.html',
  styleUrl: './file-display.component.css',
  standalone: true,
})
export class FileDisplayComponent {
  name = input("File Name");
  id = input("ID");
}
