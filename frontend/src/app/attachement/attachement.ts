import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common'; // add this import

interface SaleNotification {
  itemName: string;
  quantity: number;
  timestamp: string;
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
 isCashier: boolean = true; // so sidebar disables proper links
  isAdmin: boolean = false;
  isSales: boolean = false;
 menuOpen: boolean = false; // <-- ADD THIS LINE
  constructor(private router: Router, private location: Location) {} 
  ngOnInit() {
     const role = localStorage.getItem('role');
    this.isCashier = role === 'cashier';
    this.isAdmin = role === 'admin';
    this.isSales = role === 'sales'; 
    this.username = localStorage.getItem('username') || '';
    this.loadNotifications();
    window.addEventListener('newSale', (event: any) => {
    if (event.detail) {
      this.notifications = event.detail;
      this.newSalesCount = this.notifications.length;
      alert('New sale made!'); // optional, removes if you just want the icon to update
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
  }

  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/']);
  }
goBack() {
  this.location.back();
}

}
