import {Component, Input, numberAttribute, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {PdfViewerComponent} from "../pdf-viewer/pdf-viewer.component";
import {Router} from "@angular/router";
import {SharedService} from "../../../services/share-name.service";
import {MatCard, MatCardTitle} from "@angular/material/card";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {UpdateSearchService} from "../../../services/update-search.service";
import {RefreshService} from "../../../services/refresh.service";
import {LikesServiceService} from "../../../services/likes-service.service";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-file-display',
  templateUrl: './file-display.component.html',
  styleUrl: './file-display.component.css',
  standalone: true,
  imports: [
    MatCard,
    MatChipSet,
    MatCardTitle,
    MatChip,
    NgIf
  ]
})
export class FileDisplayComponent implements OnInit {
  constructor(private apiService: ApiService, private sharedService: SharedService,
              private router: Router, private updateSearchService: UpdateSearchService,
              private refreshService: RefreshService,
              private likeService: LikesServiceService) {
  }
  @Input() id: number = 0;
  @Input() name: string = "File";
  @Input() year:number = 1;
  @Input() subject: string = "AM"
  @Input() student: string = "Student"
  @Input() likesCount!: number;
  @Input() liked!: boolean;
  url = this.apiService.getApiUrl('Notes');

  async ngOnInit() {
    console.log(this.likesCount);
    console.log(this.liked);
  }



  navigateToFile(): void {
    const fileUrl = `${this.url}/${this.id}`;
    PdfViewerComponent.showPdf(fileUrl);
  }

  goToUserInfo() {
    this.sharedService.setInputValue(this.student);
    this.router.navigate(['/UserOverview']);
  }

  addYearFilter() {
    this.updateSearchService.addOneFilter(this.year.toString() + '.Klasse');
    this.refreshService.triggerRefresh();
  }

  addSubjectFilter() {
    this.updateSearchService.addOneFilter(this.subject.toString());
    this.refreshService.triggerRefresh();
  }

  async onLikeChanged() {
    this.liked = !this.liked;
    this.likesCount = this.liked ? this.likesCount + 1 : this.likesCount - 1;
    if(this.liked) {
      await this.likeService.likeFile(this.id);
    }else{
      await this.likeService.unlikeFile(this.id);
    }
    console.log(this.likeService.getLikedFileIds());
  }
}
