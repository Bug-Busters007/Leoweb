import {Component, Input, signal} from '@angular/core';
import {RouterLink, Router} from "@angular/router";

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrl: './module.component.css',
  standalone: true,
})
export class ModuleComponent {
  @Input() title: string = "Title";
  @Input() description: string = "Description";
  @Input() link: string = '/home';
  constructor(private router: Router) {}
  navigateTo(){
    this.router.navigate([this.link]);
  }
}
