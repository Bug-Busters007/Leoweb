import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {HeaderComponent} from "../components/header/header.component";
import {MatCardModule} from "@angular/material/card";
import {MatAnchor, MatButtonModule} from "@angular/material/button";
import {NgClass, NgForOf} from "@angular/common";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {AuthService} from "../../services/auth.service";
import { CommonModule } from '@angular/common';


interface Module {
  title: string;
  description: string;
  link: string;
  icon: string;
  iconClass: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    NgForOf,
    MatIconModule,
    MatIcon,
    NgClass,
    CommonModule,
  ]
})
export class HomeComponent implements OnInit{
  isAdmin?: boolean;
  role?: string;
  modules: Module[] = [
    {
      title: 'LeoLibrary',
      description: 'Umfassende Wissensdatenbank für deine Recherche',
      link: '/leolibrary',
      icon: 'menu_book',
      iconClass: 'library-icon'
    },
    {
      title: 'LeoChat',
      description: 'Verbinde dich und tausche dich mit anderen aus',
      link: '/leochat',
      icon: 'chat',
      iconClass: 'chat-icon'
    },
    {
      title: 'LeoPoll',
      description: 'Stimme ab und teile deine Meinung mit der Community',
      link: '/leopoll',
      icon: 'how_to_vote',
      iconClass: 'poll-icon'
    },
    {
      title: 'LeoEvents',
      description: 'Aktuelle Events',
      link: '/leoEvents',
      icon: 'event',
      iconClass: 'event-icon'
    }
  ];
  adminModule: Module = {
    title: 'AdminOptions',
    description: 'Management Seite für Admins',
    link: '/adminOverview',
    icon: 'settings',
    iconClass: 'admin-icon'
  }

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserData().subscribe((data) => {
      this.role = data.role;
      this.isAdmin = this.role === "admin";
      console.log(`User is admin: ${this.isAdmin}`);
    });
  }
  ngOnDestroy(): void {
    this.authService.logout();
  }
}
