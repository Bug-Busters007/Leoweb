import {Component, Input, numberAttribute, OnChanges, OnInit, SimpleChanges, ElementRef, Renderer2, ViewChild} from '@angular/core';
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
import {AdminOptionsComponent} from "../admin/admin-options/admin-options.component";


@Component({
  selector: 'app-file-display',
  templateUrl: './file-display.component.html',
  styleUrl: './file-display.component.scss',
  standalone: true,
  imports: [
    MatCard,
    MatChipSet,
    MatCardTitle,
    MatChip,
    NgIf,
    AdminOptionsComponent
  ]
})
export class FileDisplayComponent implements OnInit {
  @ViewChild('likeButton', { static: false }) likeButton!: ElementRef;

  constructor(private apiService: ApiService,
              private sharedService: SharedService,
              private router: Router,
              private updateSearchService: UpdateSearchService,
              private refreshService: RefreshService,
              private likeService: LikesServiceService,
              private renderer: Renderer2,
              private el: ElementRef) {
  }

  @Input() id: number = 0;
  @Input() name: string = "File";
  @Input() year: number = 1;
  @Input() subject: string = "AM"
  @Input() student: string = "Student"
  @Input() likesCount!: number;
  @Input() liked!: boolean;
  @Input() isAdmin!: boolean;
  url = this.apiService.getApiUrl('Notes');

  private previousCount = 0;

  async ngOnInit() {
    console.log(this.isAdmin);
    this.previousCount = this.likesCount;
  }

  navigateToFile(): void {
    const fileUrl = `${this.url}/${this.id}`;
    PdfViewerComponent.showPdf(fileUrl);
  }

  goToUserInfo() {
    this.sharedService.setfromWhere('/leolibrary');
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

  async onLikeChanged(event: MouseEvent) {
    this.previousCount = this.likesCount;
    this.liked = !this.liked;
    this.likesCount = this.liked ? this.likesCount + 1 : this.likesCount - 1;
    this.createRipple(event);
    if(this.liked) {
      await this.likeService.likeFile(this.id);
      this.createParticles();
      this.animateCountChange(true);
    } else {
      await this.likeService.unlikeFile(this.id);
      this.animateCountChange(false);
    }

    console.log(this.likeService.getLikedFileIds());
  }

  private createRipple(event: MouseEvent): void {
    const button = this.el.nativeElement.querySelector('.like-button');
    if (!button) return;

    const buttonRect = button.getBoundingClientRect();

    const diameter = Math.max(buttonRect.width, buttonRect.height);
    const radius = diameter / 2;

    const ripple = this.renderer.createElement('span');
    this.renderer.addClass(ripple, 'ripple');

    const x = event.clientX - buttonRect.left - radius;
    const y = event.clientY - buttonRect.top - radius;

    this.renderer.setStyle(ripple, 'width', `${diameter}px`);
    this.renderer.setStyle(ripple, 'height', `${diameter}px`);
    this.renderer.setStyle(ripple, 'left', `${x}px`);
    this.renderer.setStyle(ripple, 'top', `${y}px`);

    this.renderer.appendChild(button, ripple);
    setTimeout(() => {
      if (button.contains(ripple)) {
        this.renderer.removeChild(button, ripple);
      }
    }, 600);
  }

  private createParticles(): void {
    const button = this.el.nativeElement.querySelector('.like-button');
    if (!button) return;

    let particles = button.querySelector('.particles');
    if (!particles) {
      particles = this.renderer.createElement('div');
      this.renderer.addClass(particles, 'particles');
      this.renderer.appendChild(button, particles);
    } else {
      while (particles.firstChild) {
        particles.removeChild(particles.firstChild);
      }
    }

    for (let i = 0; i < 15; i++) {
      const particle = this.renderer.createElement('span');
      this.renderer.addClass(particle, 'particle');

      const tx = (Math.random() - 0.5) * 150;
      const ty = (Math.random() - 0.5) * 150;
      const rotation = Math.random() * 360;
      const delay = Math.random() * 0.2;

      this.renderer.setStyle(particle, '--tx', `${tx}px`);
      this.renderer.setStyle(particle, '--ty', `${ty}px`);
      this.renderer.setStyle(particle, '--r', `${rotation}deg`);
      this.renderer.setStyle(particle, 'animation-delay', `${delay}s`);
      this.renderer.setStyle(particle, 'left', '50%');
      this.renderer.setStyle(particle, 'top', '50%');

      this.renderer.appendChild(particles, particle);
    }
    setTimeout(() => {
      while (particles && particles.firstChild) {
        particles.removeChild(particles.firstChild);
      }
    }, 1200);
  }

  private animateCountChange(increasing: boolean): void {
    const button = this.el.nativeElement.querySelector('.like-button');
    if (!button) return;

    let countContainer = button.querySelector('.count-container');
    if (!countContainer) {
      countContainer = this.renderer.createElement('div');
      this.renderer.addClass(countContainer, 'count-container');
      const span = this.renderer.createElement('span');
      this.renderer.setProperty(span, 'textContent', String(this.likesCount));
      this.renderer.appendChild(countContainer, span);

      const existingSpan = button.querySelector('span');
      if (existingSpan) {
        this.renderer.insertBefore(button, countContainer, existingSpan.nextSibling);
      } else {
        this.renderer.appendChild(button, countContainer);
      }
    }

    const oldValue = this.renderer.createElement('span');
    this.renderer.addClass(oldValue, increasing ? 'count-disappear' : 'count-appear');
    this.renderer.setProperty(oldValue, 'textContent', String(this.previousCount));

    const newValue = this.renderer.createElement('span');
    this.renderer.addClass(newValue, increasing ? 'count-appear' : 'count-disappear');
    this.renderer.setProperty(newValue, 'textContent', String(this.likesCount));

    this.renderer.appendChild(countContainer, oldValue);
    this.renderer.appendChild(countContainer, newValue);

    setTimeout(() => {
      if (countContainer.contains(oldValue)) {
        this.renderer.removeChild(countContainer, oldValue);
      }
      if (countContainer.contains(newValue)) {
        this.renderer.removeChild(countContainer, newValue);
      }
    }, 500);
  }
}
