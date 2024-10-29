import express from 'express';
import {
  addOrderHistory,
  getAllOrderHistory,
  getOrderHistoryByEmail
} from '../controller/orderHistory/orderHistory.js';

const orderRouter = express.Router();

orderRouter.post('/create', addOrderHistory);
orderRouter.get('/getAll', getAllOrderHistory);
orderRouter.get('/getByEmail/:email', getOrderHistoryByEmail);
export default orderRouter;
