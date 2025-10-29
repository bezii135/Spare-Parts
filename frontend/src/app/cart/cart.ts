import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface CartItem {
  name: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  username: string = '';
  customerName: string = '';
  tinNumber: string = '';
  items: CartItem[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
    // For demo: populate selected items (replace with real selected items from ItemComponent using a service)
    this.items = [
      { name: 'Gear', partNumber: 'G123', quantity: 2, unitPrice: 100, totalPrice: 200 },
      { name: 'Bolt', partNumber: 'B456', quantity: 3, unitPrice: 2, totalPrice: 6 },
    ];
  }

  // Adjust quantity
  increase(item: CartItem) {
    item.quantity++;
    this.calculateTotal(item);
  }

  decrease(item: CartItem) {
    if(item.quantity > 0) {
      item.quantity--;
      this.calculateTotal(item);
    }
  }

  // Calculate total price for each row
  calculateTotal(item: CartItem) {
    item.totalPrice = item.quantity * item.unitPrice;
  }

  // Totals
  getTotalPrice(): number {
    return this.items.reduce((sum, i) => sum + i.totalPrice, 0);
  }

  getVAT(): number {
    return this.getTotalPrice() * 0.15; // 15% VAT
  }

  getGrandTotal(): number {
    return this.getTotalPrice() + this.getVAT();
  }

  // Sell button
  sell() {
    if(!this.customerName.trim()) {
      alert('Customer name is required!');
      return;
    }
    alert('Sale successfully completed!');
    this.router.navigate(['/item']); // Back to item page
  }

  goBack() {
    this.router.navigate(['/item']);
  }
}
