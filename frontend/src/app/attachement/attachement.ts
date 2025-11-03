import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';

interface SaleNotification {
  timestamp: string; // Date
  username: string; // User who made the sale
  customerName: string; // Customer name
  pdfFile: string; // Link to PDF file
}

@Component({
  selector: 'app-attachement',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './attachement.html',
  styleUrls: ['./attachement.css']
})
export class AttachementComponent implements OnInit {
  username: string = '';
  notifications: SaleNotification[] = [];
  newSalesCount: number = 0;
  isCashier: boolean = true;
  isAdmin: boolean = false;
  isSales: boolean = false;
  menuOpen: boolean = false;

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    const role = localStorage.getItem('role');
    this.isCashier = role === 'cashier';
    this.isAdmin = role === 'admin';
    this.isSales = role === 'sales';
    this.username = localStorage.getItem('username') || '';
    this.loadNotifications();

    // Load unread count
    this.newSalesCount = Number(localStorage.getItem('unreadSalesCount') || '0');

    window.addEventListener('newSale', (event: any) => {
      if (event.detail) {
        this.notifications = event.detail;
        this.newSalesCount = this.notifications.length;
        alert('New sale made!');
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  loadNotifications() {
    const saved = localStorage.getItem('salesNotifications');
    if (saved) {
      this.notifications = JSON.parse(saved);
      this.newSalesCount = this.notifications.length;
    }
  }

  markAllRead() {
    this.newSalesCount = 0;
    localStorage.setItem('unreadSalesCount', '0');
  }

  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/']);
  }

  goBack() {
    this.location.back();
  }
}
