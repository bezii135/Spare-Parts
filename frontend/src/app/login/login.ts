import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
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

  constructor(private router: Router) {}

  resetForm() {
    this.username = '';
    this.password = '';
    this.role = '';
    this.errorMessage = '';
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }

  login() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      (u: any) =>
        u.username === this.username &&
        u.password === this.password &&
        u.role === this.role
    );

    if (user) {
      localStorage.setItem('username', this.username);
      localStorage.setItem('role', this.role);
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Invalid username, password, or role';
      this.username = '';
      this.password = '';
      this.role = '';
    }
  }

 focusNext(event: Event) {
  const keyboardEvent = event as KeyboardEvent; // cast here
  keyboardEvent.preventDefault(); // stop form submission

  const target = keyboardEvent.target as HTMLElement;
  const form = target.closest('form');
  if (!form) return;

  const formElements = Array.from(
    form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select, button')
  );

  const index = formElements.indexOf(target as any);
  if (index > -1 && index + 1 < formElements.length) {
    formElements[index + 1].focus();
  }
}




}

