import express from 'express';
import {
  createPaymentUrl
} from '../controller/payment/paymentController.js';

const payMentrouter = express.Router();

payMentrouter.post('/create', createPaymentUrl);

export default payMentrouter;
