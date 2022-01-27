function formatPrice(price) {
  
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(price);
}

module.exports = formatPrice