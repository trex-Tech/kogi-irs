import React, { useEffect, useState } from "react";
import { PaystackButton } from "react-paystack";
import { BACKEND_URL } from "../../sonfig.service";
import axios from "axios";

function PaystackButtonComponent({ amount, email, invoice_ref, url, fethDataAction }) {
  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: amount,
    publicKey: "pk_test_ab698250e060af3bcbd23035b7e623a3312214f9",
  };

  const token = localStorage.getItem("kadir-user-token");
  

  const handlePaystackSuccessAction = (reference) => {
    // Update the backend with Paystack reference and status
    const data = {
      paystackref: reference.reference,
      status: 'Approved' // Assuming payment is successful
    };
    
   

    axios.post(`${BACKEND_URL}/api/${url}/${invoice_ref}/`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      // Handle success response from your backend
      console.log("Payment details saved successfully");
      fethDataAction();
      
    })
    .catch(error => {
      // Handle error response from your backend
      console.error("Failed to save payment details to backend:", error);
    });
  };

  const handlePaystackCloseAction = () => {
    console.log("Paystack dialog closed");
  };

  const componentProps = {
    ...config,
    text: "Pay with Paystack",
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  return (
    <PaystackButton
      {...componentProps}
      className="bg-primary w-full p-4 rounded-[6px] text-[#fff] font-poppins"
    />
  );
}

export default PaystackButtonComponent;


