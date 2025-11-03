import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cashier',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cashier.html',
  styleUrls: ['./cashier.css']
})
export class CashierComponent implements OnInit {
  username: string = '';
  isCashier: boolean = true;

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
}
