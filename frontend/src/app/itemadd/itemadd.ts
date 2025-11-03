import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({

  selector: 'app-itemadd',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './itemadd.html',
  //styleUrls: ['../admin/admin.css'] // same layout and theme
  styleUrls: ['../itemadd/itemadd.css']
})
export class ItemAddComponent implements OnInit {
  username: string = '';
sidebarVisible: boolean = false;
 dropdownVisible: boolean = false;
  // form data model
  newItem = {
    name: '',
    partNumber: '',
    quantity: 0,
    storeLocation: '',
    shelfLocation: '',
    priceBeforeVat: 0
  };

toggleSidebar() {
  this.sidebarVisible = !this.sidebarVisible;
}

toggleDropdown() {
  this.dropdownVisible = !this.dropdownVisible;
}
  constructor(private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
  
  }

  addItem() {
  const storedItems = localStorage.getItem('items');
  const allItems = storedItems ? JSON.parse(storedItems) : [];

  const newItem = {
    name: this.newItem.name,
    partNumber: this.newItem.partNumber,
    quantity: this.newItem.quantity,
    storeLocation: this.newItem.storeLocation,
    shelfLocation: this.newItem.shelfLocation,
    priceBeforeVAT: this.newItem.priceBeforeVat,  // match Item interface
    priceAfterVAT: this.newItem.priceBeforeVat * 1.15, // calculate VAT
    substitutePartNumber: '', // optional default
    selectedQuantity: 0
  };

  allItems.push(newItem);
  localStorage.setItem('items', JSON.stringify(allItems));

  alert('Item added successfully!');
  this.router.navigate(['/item']);
}


  goBack() {
    this.router.navigate(['/admin']);
  }

  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/']);
  }
}
