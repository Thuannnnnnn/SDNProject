import express from 'express';
import {
  addOrderHistory,
} from '../controller/orderHistory/orderHistory.js';

const orderRouter = express.Router();

orderRouter.post('/create', addOrderHistory);

export default orderRouter;
