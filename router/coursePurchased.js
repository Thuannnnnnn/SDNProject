import express from 'express';
import {
  addCoursePurchase,
  getAllCoursePurchases,
  getCoursePurchaseById,
  updateCoursePurchase,
  deleteCoursePurchase,
  getCoursePurchasesByEmail,
} from '../controller/coursePurchased/coursePurchasedController.js';

const coursePurchasedrouter = express.Router();

coursePurchasedrouter.post('/create', addCoursePurchase);
coursePurchasedrouter.get('/getAll', getAllCoursePurchases);
coursePurchasedrouter.get('/getByid/:id', getCoursePurchaseById);
coursePurchasedrouter.get('/getByEmail/:email', getCoursePurchasesByEmail); // New route for getting purchases by email
coursePurchasedrouter.put('/edit/:id', updateCoursePurchase);
coursePurchasedrouter.delete('/delete/:id', deleteCoursePurchase);

export default coursePurchasedrouter;
