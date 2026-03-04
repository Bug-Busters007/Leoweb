import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { Spinner } from '../components/spinner/spinner';
import { BlogEntryDisplayComponent } from '../components/blog-entry-display/blog-entry-display.component';
import { BlogEntryCreatorComponent } from '../components/blog-entry-creator/blog-entry-creator.component';
import { BlogCategoryFilterComponent } from '../components/blog-category-filter/blog-category-filter.component';
import { NgForOf, NgIf } from '@angular/common';
import { BlogEntry } from '../../models/blogEntryModel';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { RefreshService } from '../../services/refresh.service';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-leo-blog',
  templateUrl: './leo-blog.component.html',
  imports: [
    BlogEntryDisplayComponent,
    BlogEntryCreatorComponent,
    BlogCategoryFilterComponent,
    NgForOf,
    NgIf,
    MatButton,
  ],
  styleUrl: './leo-blog.component.css'
})
export class LeoBlogComponent implements OnInit, OnDestroy {
  entries: BlogEntry[] | null = [];
  filteredEntries: BlogEntry[] | null = [];
  isCreatorVisible = false;
  isAdmin = false;
  role = '';
  selectedCategory = '';
  private refreshSub: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private apiService: ApiService,
    private refreshService: RefreshService,
    private blogService: BlogService
  ) {}

  async ngOnInit() {
    // Sicherstellen, dass der eingeloggte User als Blog-User registriert ist
    await this.blogService.ensureBlogUser();

    const container = document.getElementById('blogEntriesDiv');
    const spinner = new Spinner(container);
    spinner.showSpinner();
    this.entries = await this.blogService.getAllEntries();
    this.filteredEntries = this.entries;
    spinner.removeSpinner();

    this.refreshSub = this.refreshService.refresh$.subscribe(async () => {
      this.entries = await this.blogService.getAllEntries();
      this.applyFilter();
    });

    this.authService.getUserData().subscribe((data) => {
      this.role = data.role;
      this.isAdmin = this.role === 'admin';
    });
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  showEntryCreator(): void {
    this.isCreatorVisible = !this.isCreatorVisible;
  }

  onCategorySelected(category: string): void {
    this.selectedCategory = category;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (!this.entries) {
      this.filteredEntries = null;
      return;
    }
    if (!this.selectedCategory) {
      this.filteredEntries = this.entries;
    } else {
      this.filteredEntries = this.entries.filter(
        e => e.category === this.selectedCategory
      );
    }
  }
}

