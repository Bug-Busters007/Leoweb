import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {ApiService} from "../../services/api.service";
import {CommonModule} from "@angular/common";
import {FileUploadComponent} from "../components/file-upload/file-upload.component";
import {FilterBarComponent} from "../components/filter-bar/filter-bar.component";
import {RefreshService} from "../../services/refresh.service";
import {FileSearchComponent} from "../components/file-search/file-search.component";
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-leo-library',
  templateUrl: './leo-library.component.html',
  styleUrls: ['./leo-library.component.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    FileUploadComponent,
    FilterBarComponent,
    FileSearchComponent
  ]
})
export class LeoLibraryComponent{
  isUploadDivVisible = false;
  makeVisible(){
    this.isUploadDivVisible = !this.isUploadDivVisible;
  }
}
