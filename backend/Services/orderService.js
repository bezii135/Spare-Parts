
import prisma from "../prisma/client.js"; // your Prisma client
import { generateReceiptPDF } from "../utils/pdfGenerator.js";

export async function createOrder({ storeId, customerName, customerTIN, items }) {
  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const order = await prisma.order.create({
    data: {
      storeId,
      total,
      customerName,
      customerTIN,
      items: { create: items.map(i => ({ itemId: i.itemId, quantity: i.quantity, price: i.price })) },
    },
    include: { items: { include: { item: true } }, store: true },
  });

  for (const i of items) {
    await prisma.item.update({ where: { id: i.itemId }, data: { quantity: { decrement: i.quantity } } });
  }

  const pdfPath = generateReceiptPDF(order);

  await prisma.order.update({ where: { id: order.id }, data: { pdfReceipt: pdfPath } });

  return { ...order, pdfReceipt: pdfPath };
}
