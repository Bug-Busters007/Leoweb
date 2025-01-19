import { Component } from '@angular/core';
import { NgIf} from "@angular/common";

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.css',
  standalone: true,
  imports:[
    NgIf
  ]
})
export class FilterBarComponent {
  visibilityMap: { [key: string]: boolean } = {
    informatik: false,
    medientechnik: false,
    medizintechnik: false,
    elektronik: false,
  };

  toggleVisibility(key: string){
    this.visibilityMap[key] = !this.visibilityMap[key];
  }
}
