import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BlogComment } from '../../../models/blogCommentModel';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-blog-comment-section',
  standalone: true,
  templateUrl: './blog-comment-section.component.html',
  styleUrl: './blog-comment-section.component.css',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class BlogCommentSectionComponent implements OnInit {
  @Input() entryId!: string;
  @Input() commentsAllowed = true;

  comments: BlogComment[] = [];
  newCommentText = '';
  isLoading = false;

  constructor(private blogService: BlogService) {}

  async ngOnInit() {
    await this.loadComments();
  }

  async loadComments(): Promise<void> {
    this.isLoading = true;
    const result = await this.blogService.getComments(this.entryId);
    this.comments = result ?? [];
    this.isLoading = false;
  }

  submitComment(): void {
    if (!this.newCommentText.trim()) return;

    this.blogService.addComment(this.entryId, this.newCommentText.trim()).subscribe({
      next: (comment) => {
        this.comments.push(comment);
        this.newCommentText = '';
      },
      error: (err) => {
        console.error('Error adding comment', err);
      },
    });
  }

  deleteComment(commentId: string): void {
    if (confirm('Kommentar löschen?')) {
      this.blogService.deleteComment(this.entryId, commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter(c => c.id !== commentId);
        },
        error: (err) => {
          console.error('Error deleting comment', err);
        },
      });
    }
  }

  isOwnComment(comment: BlogComment): boolean {
    return localStorage.getItem('userId') === comment.author;
  }
}



