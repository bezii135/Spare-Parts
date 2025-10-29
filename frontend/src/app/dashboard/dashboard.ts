import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  username: string = '';
  darkMode: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
  }

  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/']);
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }
}
