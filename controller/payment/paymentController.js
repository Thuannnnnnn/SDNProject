import 'dotenv/config';
import { VNPay,VnpLocale  } from 'vnpay';
import { v4 as uuidv4 } from 'uuid';
const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE,
  secureSecret: process.env.VNPAY_SECURE_SECRET,
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
  hashAlgorithm: 'SHA512',
});
export const createPaymentUrl = (req, res)=>{
  const { amount } = req.body;
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Invalid amount provided' });
  }
  const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: amount,
    vnp_IpAddr: req.ip,
    vnp_TxnRef: uuidv4(),
    vnp_OrderInfo: 'Payment for buy course',
    vnp_OrderType: 'other',
    vnp_ReturnUrl: `http://localhost:8080/vnpay-return`,
    vnp_Locale: VnpLocale.EN,
  });

  res.json({ paymentUrl });
};
