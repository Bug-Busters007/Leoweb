import {Component, Input} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {PdfViewerComponent} from "../pdf-viewer/pdf-viewer.component";
import {Router} from "@angular/router";
import {SharedService} from "../../../services/share-name.service";


@Component({
  selector: 'app-file-display',
  templateUrl: './file-display.component.html',
  styleUrl: './file-display.component.css',
  standalone: true,
})
export class FileDisplayComponent {
  constructor(private apiService: ApiService, private sharedService: SharedService, private router: Router) {
  }
  @Input() id: number = 0;
  @Input() name: string = "File";
  @Input() year:number = 1;
  @Input() subject: string = "AM"
  @Input() student: string = "Student"
  url = this.apiService.getApiUrl('Notes');


  navigateToFile(): void {
    const fileUrl = `${this.url}/${this.id}`;
    PdfViewerComponent.showPdf(fileUrl);
  }

  goToUserInfo() {
    this.sharedService.setInputValue(this.student);
    this.router.navigate(['/UserOverview']);
  }
}

