import { Component, Input } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from "../../../services/api.service";
import {Spinner} from "../spinner/spinner";
import {FileDisplayComponent} from "../file-display/file-display.component";
import {Router} from '@angular/router';
import {SharedService} from "../../../services/share-name.service";
import {NgForOf} from "@angular/common";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  standalone: true,
  imports: [
    FileDisplayComponent,
    NgForOf
  ],
  styleUrl: './user-overview.component.css'
})
export class UserOverviewComponent {
  fileArray: { id: number; name: string; year: number, subject: string, student: string}[] = [];
  @Input() username: string = '';
  constructor(private authService: AuthService, private http: HttpClient, private apiService: ApiService, private sharedService: SharedService, private router: Router) {}

  async ngOnInit() {
    this.username = this.sharedService.getInputValue();
    const spinner: Spinner = new Spinner(document.getElementById('filesListed'));
    spinner.showSpinner();
    this.fileArray = this.sharedService.getFileArray();
    this.fileArray = this.filterFiles();
    spinner.removeSpinner();
  }

  filterFiles(){
    const files: any[] = [];
    for (let file of this.fileArray){
      if (file.student === this.username){
        files.push(file);
      }
    }
    return files;
  }

  goBack(): void {
    this.router.navigate(['/leolibrary']);
  }
}
