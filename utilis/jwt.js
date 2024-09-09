import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const encode = (email, name) =>{
  const privateKey = process.env.PRIVATE_KEY;
  const payload = {
    email,
    name
  };
  const token = jsonwebtoken.sign(payload, privateKey, { expiresIn: '2h'});
  return token;
};

export default encode;