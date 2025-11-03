import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  includeVAT: boolean = true;
  username: string = '';
  customerName: string = '';
  tinNumber: string = '';
  items: CartItem[] = [];

  constructor(private router: Router) {}

  saveAttachment(customerName: string) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    if (!cartItems.length) return;

    let attachmentNumber = Number(localStorage.getItem('lastAttachmentNumber') || '0') + 1;
    localStorage.setItem('lastAttachmentNumber', attachmentNumber.toString());

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Yodit Getachew Tegegn - Auto Spare Parts', 14, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${customerName}`, 14, 30);
    doc.text(`Attachment No: ${String(attachmentNumber).padStart(6, '0')}`, 150, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 36);
    doc.text(`Time: ${new Date().toLocaleTimeString()}`, 150, 42);

    const tableData = cartItems.map((item: any, index: number) => [
      index + 1,
      item.name,
      item.quantity,
      'Pcs',
      item.unitPrice.toFixed(2),
      (item.quantity * item.unitPrice).toFixed(2),
    ]);

    (doc as any).autoTable({
      startY: 50,
      head: [['ID', 'Description', 'Qty', 'Unit', 'Unit Price', 'Total Price']],
      body: tableData,
    });

    const total = cartItems.reduce((sum: number, i: any) => sum + i.quantity * i.unitPrice, 0);
    const vat = total * 0.15;
    const grandTotal = total + vat;

    doc.text(`Total: ${total.toFixed(2)}`, 150, (doc as any).lastAutoTable.finalY + 10);
    doc.text(`VAT(15%): ${vat.toFixed(2)}`, 150, (doc as any).lastAutoTable.finalY + 16);
    doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, 150, (doc as any).lastAutoTable.finalY + 22);

    doc.save(`Attachment${customerName}${String(attachmentNumber).padStart(7, '0')}.pdf`);

    const attachments = JSON.parse(localStorage.getItem('attachments') || '[]');
    attachments.push({ customer: customerName, number: attachmentNumber, date: new Date(), items: cartItems });
    localStorage.setItem('attachments', JSON.stringify(attachments));
  }

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
    this.loadCart();
  }

  loadCart() {
    const storedItems = localStorage.getItem('cartItems');
    this.items = storedItems ? JSON.parse(storedItems).map((item: any) => ({
      ...item,
      totalPrice: item.quantity * item.unitPrice
    })) : [];
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  getVAT(): number {
    return this.getTotalPrice() * 0.15;
  }

  getGrandTotal(): number {
    return this.getTotalPrice() + this.getVAT();
  }

  sell() {
    if (!this.customerName) {
      alert('Customer name is required!');
      return;
    }

    const storedItems = localStorage.getItem('items');
    if (storedItems) {
      const allItems = JSON.parse(storedItems);
      this.items.forEach(cartItem => {
        const item = allItems.find((i: any) => i.partNumber === cartItem.partNumber);
        if (item) {
          item.quantity -= cartItem.quantity;
          if (item.quantity < 0) item.quantity = 0;
        }
      });
      localStorage.setItem('items', JSON.stringify(allItems));
    }

    const salesHistory = JSON.parse(localStorage.getItem('salesHistory') || '[]');
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    const allItems = JSON.parse(localStorage.getItem('items') || '[]');

    this.items.forEach(cartItem => {
      const item = allItems.find((i: any) => i.partNumber === cartItem.partNumber);
      const storeLocation = item ? item.storeLocation : 'Unknown';
      salesHistory.push({
        date: dateStr,
        time: timeStr,
        itemName: cartItem.name,
        username: this.username,
        partNumber: cartItem.partNumber,
        quantity: cartItem.quantity,
        customerName: this.customerName,
        price: this.includeVAT ? cartItem.totalPrice * 1.15 : cartItem.totalPrice,
        storeLocation,
        withVAT: this.includeVAT
      });
    });

    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));

    const attachmentNumber = String(Number(localStorage.getItem('lastAttachmentNumber') || '0') + 1).padStart(7, '0');
    localStorage.setItem('lastAttachmentNumber', attachmentNumber);

    const saleNotification = {
      timestamp: now.toLocaleString(),
      username: this.username,
      customerName: this.customerName,
      pdfFile: `Attachment${this.customerName}${attachmentNumber}.pdf`
    };

    const existingNotifications = JSON.parse(localStorage.getItem('salesNotifications') || '[]');
    existingNotifications.push(saleNotification);
    localStorage.setItem('salesNotifications', JSON.stringify(existingNotifications));

    let unreadCount = Number(localStorage.getItem('unreadSalesCount') || '0');
    unreadCount += 1;
    localStorage.setItem('unreadSalesCount', unreadCount.toString());

    window.dispatchEvent(new CustomEvent('newSale', { detail: existingNotifications }));
    alert('Sale successfully completed!');
    localStorage.removeItem('cartItems');
    this.router.navigate(['/item']);
  }

  goBack() {
    this.router.navigate(['/item']);
  }
}
