import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BlogService } from '../../../services/blog.service';
import { BlogCategory } from '../../../models/blogCategoryModel';

@Component({
  selector: 'app-blog-category-filter',
  standalone: true,
  templateUrl: './blog-category-filter.component.html',
  styleUrl: './blog-category-filter.component.css',
  imports: [
    CommonModule,
    NgForOf,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
})
export class BlogCategoryFilterComponent implements OnInit {
  @Output() categorySelected = new EventEmitter<string>();

  categories: BlogCategory[] = [];
  selectedCategory = '';

  constructor(private blogService: BlogService) {}

  async ngOnInit() {
    const result = await this.blogService.getCategories();
    this.categories = result ?? [];
  }

  selectCategory(categoryName: string): void {
    if (this.selectedCategory === categoryName) {
      this.selectedCategory = '';
    } else {
      this.selectedCategory = categoryName;
    }
    this.categorySelected.emit(this.selectedCategory);
  }

  clearFilter(): void {
    this.selectedCategory = '';
    this.categorySelected.emit('');
  }
}



