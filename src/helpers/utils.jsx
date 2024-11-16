import CryptoJS from 'crypto-js';

export const computeHMACSHA256Base64 = (payload) => {

  const apiKey = "ZigqHWjXuT0LTBIM9cN/rrIvnHSMQ248zNUfMov2wUp4PCI8A7Vrl8YuI0C+zHqBDebQ3pGgISvaTfCPGwKexg=="
  const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);

  const hash = CryptoJS.HmacSHA256(payloadString, apiKey);

  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

  return hashInBase64;
};
