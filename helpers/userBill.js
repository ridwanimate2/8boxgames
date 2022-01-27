function userBill(data) {
  let result = 0
  data.forEach(el => {
    result += el.Game.price
  });

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(result);
}

module.exports = userBill