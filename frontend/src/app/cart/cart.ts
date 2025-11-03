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
  showSuccessMessage = false;

  constructor(private router: Router) {}

  // ===========================
  // SAVE ATTACHMENT (PDF)
  // ===========================
  saveAttachment(customerName: string) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    if (!cartItems.length) return;

    // Get and increment last attachment number
    let lastNumber = Number(localStorage.getItem('lastAttachmentNumber') || '0');
    const attachmentNumber = lastNumber + 1;
    localStorage.setItem('lastAttachmentNumber', attachmentNumber.toString());

    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.text('Yodit Getachew Tegegn - Auto Spare Parts', 14, 20);

    // Customer Info
    doc.setFontSize(12);
    const now = new Date();
    const attachmentNumberStr = String(attachmentNumber).padStart(7, '0');
    doc.text(`Name: ${customerName}`, 14, 30);
    doc.text(`Attachment No: ${attachmentNumberStr}`, 150, 30);
    doc.text(`Date: ${now.toLocaleDateString()}`, 150, 36);
    doc.text(`Time: ${now.toLocaleTimeString()}`, 150, 42);

    // Table Data
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

    // Totals
    const total = cartItems.reduce((sum: number, i: any) => sum + i.quantity * i.unitPrice, 0);
    const vat = total * 0.15;
    const grandTotal = total + vat;

    doc.text(`Total: ${total.toFixed(2)}`, 150, (doc as any).lastAutoTable.finalY + 10);
    doc.text(`VAT(15%): ${vat.toFixed(2)}`, 150, (doc as any).lastAutoTable.finalY + 16);
    doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, 150, (doc as any).lastAutoTable.finalY + 22);

    // Generate data URI and filename
    const dataUri = (doc as any).output('datauristring');
    const filename = `Attachment${customerName}${attachmentNumberStr}.pdf`;

    // Save to disk
    doc.save(filename);

    // Save info in localStorage for attachment page
    const attachments = JSON.parse(localStorage.getItem('attachments') || '[]');
    attachments.push({
      customer: customerName,
      username: localStorage.getItem('username') || '',
      number: attachmentNumber,
      numberStr: attachmentNumberStr,
      date: now.toLocaleDateString(),
      timestamp: now.toLocaleString(),
      items: cartItems,
      filename,
      pdfDataUri: dataUri
    });
    localStorage.setItem('attachments', JSON.stringify(attachments));
  }

  // ===========================
  // INIT & LOAD CART
  // ===========================
  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
    this.loadCart();
  }

  loadCart() {
    const storedItems = localStorage.getItem('cartItems');
    this.items = storedItems
      ? JSON.parse(storedItems).map((item: any) => ({
          ...item,
          totalPrice: item.quantity * item.unitPrice
        }))
      : [];
  }

  // ===========================
  // PRICE CALCULATIONS
  // ===========================
  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  getVAT(): number {
    return this.getTotalPrice() * 0.15;
  }

  getGrandTotal(): number {
    return this.getTotalPrice() + this.getVAT();
  }

  // ===========================
  // SELL FUNCTION
  // ===========================
  sell() {
    if (!this.customerName) {
      alert('Customer name is required!');
      return;
    }

    // --- Update stock quantities ---
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

    // --- Save to sales history ---
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
        storeLocation: storeLocation,
        withVAT: this.includeVAT
      });
    });

    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));

    // --- Play notification sound ---
    const audio = new Audio('assets/notification.mp3');
    audio.play().catch(err => console.log('Audio play error:', err));

    // --- Generate PDF attachment ---
    this.saveAttachment(this.customerName);

    // --- Create notification object ---
    const attachments = JSON.parse(localStorage.getItem('attachments') || '[]');
    const lastAttachment = attachments[attachments.length - 1];
    const notification = {
      customerName: this.customerName,
      username: this.username,
      timestamp: new Date().toLocaleString(),
      attachmentNumber: lastAttachment ? String(lastAttachment.number).padStart(7, '0') : '0000000',
      filename: lastAttachment ? lastAttachment.filename : '',
      pdfDataUri: lastAttachment ? lastAttachment.pdfDataUri : ''
    };

    // --- Save notification ---
    const existingNotifications = JSON.parse(localStorage.getItem('salesNotifications') || '[]');
    existingNotifications.push(notification);
    localStorage.setItem('salesNotifications', JSON.stringify(existingNotifications));

    // --- Dispatch real-time event ---
    window.dispatchEvent(new CustomEvent('newSale', { detail: existingNotifications }));

    alert('Sale successfully completed!');

    // --- Clear cart and redirect ---
    localStorage.removeItem('cartItems');
    this.router.navigate(['/item']);
  }

  // ===========================
  // BACK BUTTON
  // ===========================
  goBack() {
    this.router.navigate(['/item']);
  }
}
