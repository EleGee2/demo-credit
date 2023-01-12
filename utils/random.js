exports.generateTransactionReference = (x = 9, alphanumeric = true) => {
  let text = "";
  const possible = alphanumeric ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" : "0123456789";
  for (let i = 0; i < (x || 15); i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return "".concat(text);
};