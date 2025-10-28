import { createOrder } from "./Services/orderService.js";

async function test() {
  const newOrder = await createOrder({
    storeId: 1,                  // replace with a valid storeId in your DB
    customerName: "John Doe",    // test customer name
    customerTIN: "1234567890",   // test TIN
    items: [
      { itemId: 1, quantity: 2, price: 50 }, // replace with valid itemId
      { itemId: 2, quantity: 1, price: 30 }, // replace with valid itemId
    ],
  });

  console.log("Order created:", newOrder);
}

test();
