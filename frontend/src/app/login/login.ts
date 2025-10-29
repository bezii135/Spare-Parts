import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  role: string = '';
  errorMessage: string = '';

  // Define allowed users with role
  allowedUsers = [
    { username: 'admin', password: 'admin', role: 'admin' },
    { username: 'sales', password: 'sales', role: 'sales' },
    { username: 'cashier', password: 'cashier', role: 'cashier' },
  ];

  constructor(private router: Router) {
    // Reset form when navigating to login
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.urlAfterRedirects === '/') {
          this.resetForm();
        }
      });
  }

  ngOnInit() {
    this.resetForm();
  }

  resetForm() {
    this.username = '';
    this.password = '';
    this.role = '';
    this.errorMessage = '';
    localStorage.removeItem('username');
  }

  login() {
    // Check for user match with role
    const user = this.allowedUsers.find(
      u => u.username === this.username && u.password === this.password && u.role === this.role
    );

    if (user) {
      localStorage.setItem('username', this.username);
      localStorage.setItem('role', this.role); // optional if you need role later
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Invalid username, password, or role';
      this.username = '';
      this.password = '';
      this.role = '';
    }
  }
}
