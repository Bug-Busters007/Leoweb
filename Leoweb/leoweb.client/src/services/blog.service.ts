import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { BlogEntry } from '../models/blogEntryModel';
import { BlogComment } from '../models/blogCommentModel';
import { BlogCategory } from '../models/blogCategoryModel';
import { CreateBlogEntryRequest } from '../models/createBlogEntryRequest';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  apiUrl = environment.apiUrl;

  constructor(private apiService: ApiService, private http: HttpClient) {}

  async getAllEntries(): Promise<BlogEntry[] | null> {
    const url = this.apiService.getApiUrl('Blog/all');
    try {
      const response = await firstValueFrom(this.http.get<BlogEntry[]>(url));
      return response ?? null;
    } catch (error) {
      console.error('Error getting all blog entries', error);
      return null;
    }
  }

  async getEntryById(id: string): Promise<BlogEntry | null> {
    const url = this.apiService.getApiUrl(`Blog/${id}`);
    try {
      const response = await firstValueFrom(this.http.get<BlogEntry>(url));
      return response ?? null;
    } catch (error) {
      console.error('Error getting blog entry', error);
      return null;
    }
  }

  async getEntriesByCategory(category: string): Promise<BlogEntry[] | null> {
    const url = this.apiService.getApiUrl(`Blog/category/${category}`);
    try {
      const response = await firstValueFrom(this.http.get<BlogEntry[]>(url));
      return response ?? null;
    } catch (error) {
      console.error('Error getting entries by category', error);
      return null;
    }
  }

  async getCategories(): Promise<BlogCategory[] | null> {
    const url = this.apiService.getApiUrl('Blog/categories');
    try {
      const response = await firstValueFrom(this.http.get<BlogCategory[]>(url));
      return response ?? null;
    } catch (error) {
      console.error('Error getting categories', error);
      return null;
    }
  }

  async ensureBlogUser(): Promise<void> {
    const url = this.apiService.getApiUrl('Blog/register');
    try {
      await firstValueFrom(this.http.post(url, {}));
    } catch (error: any) {
      // 409 Conflict = User existiert bereits, das ist OK
      if (error.status !== 409) {
        console.error('Error registering blog user', error);
      }
    }
  }

  createEntry(entry: CreateBlogEntryRequest): Observable<BlogEntry> {
    const url = this.apiService.getApiUrl('Blog');
    return this.http.post<BlogEntry>(url, entry);
  }

  updateEntry(id: string, entry: BlogEntry): Observable<BlogEntry> {
    const url = this.apiService.getApiUrl(`Blog/${id}`);
    return this.http.put<BlogEntry>(url, entry);
  }

  deleteEntry(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Blog/${id}`);
  }

  async getComments(entryId: string): Promise<BlogComment[] | null> {
    const url = this.apiService.getApiUrl(`Blog/${entryId}/comments`);
    try {
      const response = await firstValueFrom(this.http.get<BlogComment[]>(url));
      return response ?? null;
    } catch (error) {
      console.error('Error getting comments', error);
      return null;
    }
  }

  addComment(entryId: string, text: string): Observable<BlogComment> {
    const url = this.apiService.getApiUrl(`Blog/${entryId}/comments`);
    return this.http.post<BlogComment>(url, { text });
  }

  deleteComment(entryId: string, commentId: string): Observable<void> {
    const url = this.apiService.getApiUrl(`Blog/${entryId}/comments/${commentId}`);
    return this.http.delete<void>(url);
  }

  incrementImpressionCount(entryId: string): Observable<void> {
    const url = this.apiService.getApiUrl(`Blog/${entryId}/impression`);
    return this.http.post<void>(url, {});
  }
}
