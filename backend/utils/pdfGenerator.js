import PDFDocument from "pdfkit";
import fs from "fs";

export function generateReceiptPDF(order) {
  if (!fs.existsSync("./receipts")) fs.mkdirSync("./receipts");

  const filePath = `./receipts/order_${order.id}.pdf`;
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Sale Receipt", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Order ID: ${order.id}`);
  doc.text(`Customer Name: ${order.customerName || "N/A"}`);
  doc.text(`Customer TIN: ${order.customerTIN || "N/A"}`);
  doc.text(`Store: ${order.store.name}`);
  doc.moveDown();

  doc.text("Items:");
  order.items.forEach((item) => {
    doc.text(`${item.item.name} - Qty: ${item.quantity} - Price: $${item.price}`);
  });

  doc.moveDown();
  doc.text(`Total: $${order.total}`);
  doc.end();

  return filePath;
}
