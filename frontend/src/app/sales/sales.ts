import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sales.html',
  styleUrls: ['./sales.css']
})
export class SalesComponent implements OnInit {
  username: string = '';
  darkMode: boolean = false;
  menuOpen: boolean = false; // toggle menu for mobile

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
  }

  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/']);
  }

  goBack() {
    this.location.back();
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
