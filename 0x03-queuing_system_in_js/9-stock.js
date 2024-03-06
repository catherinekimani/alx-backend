import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);

const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

const getItemById = (id) => {
  return listProducts.find((item) => item.itemId === id);
};

const reserveStockById = (itemId, stock) => {
  client.set(`item.${itemId}`, stock);
};

const getCurrentReservedStockById = async (itemId) => {
  const reservedStock = await getAsync(`item.${itemId}`);
  return reservedStock ? parseInt(reservedStock) : 0;
};

app.get('/list_products', (request, response) => {
  response.json(listProducts.map((item) => ({
    itemId: item.itemId,
    itemName: item.itemName,
    price: item.price,
    initialAvailableQuantity: item.initialAvailableQuantity
  })));
});

app.get('/list_products/:itemId', async (request, response) => {
  const itemId = parseInt(request.params.itemId);
  const item = getItemById(itemId);

  if (!item) {
    return response.json({ status: 'Product not found' });
  }

  const currentQuantity = item.initialAvailableQuantity - await getCurrentReservedStockById(itemId);

  response.json({
    itemId: item.itemId,
    itemName: item.itemName,
    price: item.price,
    initialAvailableQuantity: item.initialAvailableQuantity,
    currentQuantity
  });
});

app.get('/reserve_product/:itemId', async (request, response) => {
  const itemId = parseInt(request.params.itemId);
  const item = getItemById(itemId);

  if (!item) {
    return response.json({ status: 'Product not found' });
  }

  const currentQuantity = item.initialAvailableQuantity - await getCurrentReservedStockById(itemId);

  if (currentQuantity <= 0) {
    return response.json({ status: 'Not enough stock available', itemId });
  }

  reserveStockById(itemId, await getCurrentReservedStockById(itemId) + 1);
  response.json({ status: 'Reservation confirmed', itemId });
});

const PORT = 1245;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
