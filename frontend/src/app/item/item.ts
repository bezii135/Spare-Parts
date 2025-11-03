import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';

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
  isSalesUser: boolean = false; 
showConfirmModal: boolean = false;
deleteIndex: number | null = null;


  items: Item[] = [
    { name: 'Shoe kit', partNumber: '04495-60080', quantity: 10, storeLocation: 'Main Store', shelfLocation: 'A1', priceBeforeVAT: 100, priceAfterVAT: 115, substitutePartNumber: '54321', selectedQuantity: 0 },
    { name: 'Filter', partNumber: '90915-30002', quantity: 10, storeLocation: 'Main Store', shelfLocation: 'A1', priceBeforeVAT: 100, priceAfterVAT: 115, substitutePartNumber: '30001', selectedQuantity: 0 },
    { name: 'Pad', partNumber: '04465-YZZF6', quantity: 10, storeLocation: 'Main Store', shelfLocation: 'A1', priceBeforeVAT: 100, priceAfterVAT: 115, substitutePartNumber: 'YZZF7', selectedQuantity: 0 }
  ];
tableColumns = [
  { label: 'Item Name', prop: 'name' },
  { label: 'Part Number', prop: 'partNumber' },
  { label: 'Quantity', prop: 'quantity' },
  { label: 'Store Location', prop: 'storeLocation' },
  { label: 'Shelf Location', prop: 'shelfLocation' },
  { label: 'Price Before VAT', prop: 'priceBeforeVAT' },
  { label: 'Price After VAT', prop: 'priceAfterVAT' },
  { label: 'Substitute Part Number', prop: 'substitutePartNumber' },
  { label: 'Quantity Selected', prop: 'selectedQuantity' },
  { label: 'Update', prop: 'update' },
  { label: 'Delete', prop: 'delete' }
];

  //constructor(private router: Router) {}
  // Add at the top with your other properties
menuOpen: boolean = false;

// Add this method inside the class
toggleMenu() {
  this.menuOpen = !this.menuOpen;
}


  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
 const role = localStorage.getItem('role');
  this.isSalesUser = role === 'sales'; // ← important
 
 
    const savedItems = localStorage.getItem('items');
  if (savedItems) {
    this.items = JSON.parse(savedItems);
  }
  
  }

 increase(item: Item) {
  if (item.selectedQuantity < item.quantity) item.selectedQuantity++;
}

decrease(item: Item) {
  if (item.selectedQuantity > 0) item.selectedQuantity--;
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
  // Save only items with selectedQuantity > 0
  const selectedItems = this.items
    .filter(item => item.selectedQuantity > 0)
    .map(item => ({
      name: item.name,
      partNumber: item.partNumber,
      quantity: item.selectedQuantity,
      unitPrice: item.priceBeforeVAT
    }));

  // Save cart items
  localStorage.setItem('cartItems', JSON.stringify(selectedItems));

 
  // Navigate to cart page
  this.router.navigate(['/cart']);
}


editingIndex: number | null = null;

enableEdit(index: number) {
  if (this.isSalesUser) {
    this.editingIndex = index; // only substitutePartNumber editable in template
  } else {
    this.editingIndex = index; // admin can edit everything
  }
}


disableEdit(index: number) {
  const item = this.items[index];

  if (!this.isSalesUser) {
    // Admin: update all editable fields if needed
    item.priceAfterVAT = item.priceBeforeVAT * 1.15; 
  }

  // Sales: only Substitute Part Number is editable, other fields remain unchanged

  this.editingIndex = null;
  this.saveItems(); // save changes
}

deleteItem(index: number) {
  this.deleteIndex = index;
  this.showConfirmModal = true; // show modal instead of browser confirm
}

confirmDelete() {
  if (this.deleteIndex !== null) {
    this.items.splice(this.deleteIndex, 1);
    this.saveItems();
  }
  this.showConfirmModal = false;
  this.deleteIndex = null;
}

// User clicks Cancel
cancelDelete() {
  this.showConfirmModal = false;
  this.deleteIndex = null;
}

saveItems() {
  localStorage.setItem('items', JSON.stringify(this.items));
}

constructor(private router: Router, private location: Location) {}


goBack() {
  this.location.back();
}


}

