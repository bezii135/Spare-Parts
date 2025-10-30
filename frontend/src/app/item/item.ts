import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface Item {
  name: string;
  partNumber: string;
  quantity: number;
  storeLocation: string;
  shelfLocation: string;
  priceBeforeVAT: number;
  priceAfterVAT: number;
  substitutePartNumber: string;
  selectedQuantity: number;
}

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './item.html',
  styleUrls: ['./item.css']
})
export class ItemComponent implements OnInit {
  username: string = '';
  searchTerm: string = '';
  items: Item[] = [
    { name: 'Shoe kit', partNumber: '04495-60080', quantity: 10, storeLocation: 'Main Store', shelfLocation: 'A1', priceBeforeVAT: 100, priceAfterVAT: 115, substitutePartNumber: '54321', selectedQuantity: 0 },
    { name: 'Filter', partNumber: '90915-30002', quantity: 10, storeLocation: 'Main Store', shelfLocation: 'A1', priceBeforeVAT: 100, priceAfterVAT: 115, substitutePartNumber: '30001', selectedQuantity: 0 },
    { name: 'Pad', partNumber: '04465-YZZF6', quantity: 10, storeLocation: 'Main Store', shelfLocation: 'A1', priceBeforeVAT: 100, priceAfterVAT: 115, substitutePartNumber: 'YZZF7', selectedQuantity: 0 }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
  }

  increase(index: number) {
    if (this.items[index].selectedQuantity < this.items[index].quantity) this.items[index].selectedQuantity++;
  }

  decrease(index: number) {
    if (this.items[index].selectedQuantity > 0) this.items[index].selectedQuantity--;
  }

  filteredItems() {
    if (!this.searchTerm) return this.items;
    const term = this.searchTerm.toLowerCase();
    return this.items.filter(i =>
      i.name.toLowerCase().includes(term) || i.partNumber.toLowerCase().includes(term)
    );
  }

 totalSelectedItems(): number {
  return this.items.reduce((sum, item) => sum + item.selectedQuantity, 0);
}

goToCart() {
  this.router.navigate(['/cart']);
}

}
