import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SharedService {
  private inputValue: string = '';

  setInputValue(value: string) {
    this.inputValue = value;
  }

  getInputValue() {
    return this.inputValue;
  }
}
