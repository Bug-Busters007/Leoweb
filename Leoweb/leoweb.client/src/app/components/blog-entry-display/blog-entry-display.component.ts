import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { BlogEntry } from '../../../models/blogEntryModel';
import { BlogCommentSectionComponent } from '../blog-comment-section/blog-comment-section.component';
import { BlogService } from '../../../services/blog.service';
import { RefreshService } from '../../../services/refresh.service';

@Component({
  selector: 'app-blog-entry-display',
  standalone: true,
  templateUrl: './blog-entry-display.component.html',
  styleUrl: './blog-entry-display.component.css',
  imports: [
    CommonModule,
    NgForOf,
    NgIf,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    BlogCommentSectionComponent,
  ],
})
export class BlogEntryDisplayComponent implements OnInit {
  @Input() entry!: BlogEntry;
  @Input() isAdmin = false;

  isExpanded = false;
  isOwner = false;

  constructor(
    private blogService: BlogService,
    private refreshService: RefreshService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('userId') === this.entry.author?.userId) {
      this.isOwner = true;
    }
  }

  toggleExpand(): void {
    if (!this.isExpanded) {
      // Increment impression count when opening
      this.blogService.incrementImpressionCount(this.entry.id).subscribe();
      this.entry.impressionCount++;
    }
    this.isExpanded = !this.isExpanded;
  }

  deleteEntry(): void {
    if (confirm('Bist du sicher, dass du diesen Eintrag löschen möchtest?')) {
      this.blogService.deleteEntry(this.entry.id).subscribe({
        next: () => {
          this.refreshService.triggerRefresh();
        },
        error: (err) => {
          console.error('Error deleting entry', err);
        },
      });
    }
  }

  getAuthorName(): string {
    if (this.entry.author) {
      return `${this.entry.author.firstname} ${this.entry.author.lastname}`;
    }
    return 'Unbekannt';
  }

  getLastEditDate(): string | null {
    if (this.entry.editDates && this.entry.editDates.length > 0) {
      return this.entry.editDates[this.entry.editDates.length - 1];
    }
    return null;
  }
}

