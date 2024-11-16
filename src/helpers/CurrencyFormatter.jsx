export const convertCurrency = (amount) => {
  // Check if the input is a valid number
  if (isNaN(amount)) {
    return "Invalid input. Please provide a valid number.";
  }

  // Format the number with NGN currency
  const ngnFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  // Format and return the result
  const ngnAmount = ngnFormatter.format(amount);

  return ngnAmount;
};
