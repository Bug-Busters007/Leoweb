import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LikesServiceService {
  constructor(private apiService: ApiService, private http: HttpClient) {}
  async getLikedFileIds() {
    return this.http.get<number[]>(this.apiService.getApiUrl('Notes/fileIdsWithLikesFromUser')).toPromise();
  }

  async likeFile(fileId: number) {
    const apiUrl = this.apiService.getApiUrl('Notes/like/' + fileId);
    return this.http.post(apiUrl, fileId).toPromise();
  }

  async unlikeFile(fileId: number) {
    const apiUrl = this.apiService.getApiUrl('Notes/unlike/' + fileId);
    return this.http.delete(apiUrl).toPromise();
  }

  async getLikeCount(id: number) {
    const apiUrl = this.apiService.getApiUrl('Notes/numOfLikes/' + id);
    return this.http.get<number>(apiUrl).toPromise();
  }
}
