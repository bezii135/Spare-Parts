import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.html',
 styleUrls: ['../dashboard/dashboard.css']   // use the same dashboard CSS
})
export class AdminComponent implements OnInit {
  username: string = '';
  darkMode: boolean = false; // dark mode toggle

  constructor(private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
  }

  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['/dashboard']); // goes back to dashboard
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }
}
