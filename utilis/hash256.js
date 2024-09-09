import crypto from 'crypto';

const hashString = (str) => {
  return crypto.createHash('sha256').update(str).digest('hex');
};

export default hashString;
