import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
interface Sale {
  date: string;
  time: string;
  itemName: string;
  username: string;
  partNumber: string;
  quantity: number;
  customerName: string;
  price: number;
  storeLocation: string;
  withVAT: boolean;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './history.html',
  styleUrls: ['./history.css']   // you can reuse admin.css or make a new one
})
export class HistoryComponent implements OnInit {
  username: string = '';
  isSalesUser: boolean = false;  // <-- add this line
  sales: Sale[] = [];

  isMenuOpen = false;

toggleMenu() {
  this.isMenuOpen = !this.isMenuOpen;
  const navMenu = document.querySelector('.topbar nav ul');
  if (navMenu) {
    if (this.isMenuOpen) {
      navMenu.classList.add('show');
    } else {
      navMenu.classList.remove('show');
    }
  }
}


  //constructor(private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
    const role = localStorage.getItem('role') || '';
    this.isSalesUser = role === 'sales';  // <-- add this
    this.sales = JSON.parse(localStorage.getItem('salesHistory') || '[]');
}


  getPrice(sale: Sale) {
    return sale.price;
  }

 goBack() {
  this.location.back();
}
constructor(private location: Location) {}



}
