import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';

interface User {
  username: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-useraddremove',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './useraddremove.html',
  styleUrls: ['../useraddremove/useraddremove.css']
})
export class UserAddRemoveComponent implements OnInit {
  username: string = '';
  sidebarVisible:boolean = false;
  dropdownVisible:boolean = false;
  users: User[] = [];
  newUser: User = { username: '', password: '', role: '' };

  

toggleSidebar(){
  this.sidebarVisible = !this.sidebarVisible;
}
toggleDropdown(){
  this.dropdownVisible = !this.dropdownVisible;
}

constructor(private router: Router) {}

 ngOnInit() {
    this.username = localStorage.getItem('username') || '';
    const savedUsers = localStorage.getItem('users');
    this.loadUsers();
  this.resetForm();
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    }
  }

loadUsers() {
  this.users = JSON.parse(localStorage.getItem('users') || '[]');  // <--- added
}
 

  addUser() {
  if (!this.newUser.username || !this.newUser.password || !this.newUser.role) {
    alert('Please fill all fields');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  users.push({
    username: this.newUser.username,
    password: this.newUser.password,
    role: this.newUser.role
  });

  localStorage.setItem('users', JSON.stringify(users));
  this.loadUsers(); // refresh the table

  // Clear the form fields automatically
  this.resetForm();
}

resetForm() {
  this.newUser.username = '';
  this.newUser.password = '';
  this.newUser.role = '';
}


  deleteUser(index: number) {
    const uname = this.users[index].username;
    if (confirm(`Are you sure you want to delete "${uname}"? Click OK to confirm.`)) {
      this.users.splice(index, 1);
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}
