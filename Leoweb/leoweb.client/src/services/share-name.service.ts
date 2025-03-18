import { Injectable } from '@angular/core';
import {LeoLibraryComponent} from "../app/leo-library/leo-library.component";
import {FileSearchComponent} from "../app/components/file-search/file-search.component";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environments";

@Injectable({ providedIn: 'root' })
export class SharedService {
  // this component has all files saved which any component can use and filter
  private inputValue: string = '';
  private fileArray: { id: number; name: string; year: number; student: string; subject: string }[] = [];
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  setInputValue(value: string) {
    this.inputValue = value;
  }

  getInputValue() {
    return this.inputValue;
  }

  setFileArray(value: any[]) {
    this.fileArray = value;
  }

  getFileArray() {
    return this.fileArray;
  }

  deleteFile(id: number) : Observable<void> {
    console.log('sending request');
    return this.http.delete<void>(`${this.apiUrl}/Notes/${id}`);
  }
}
