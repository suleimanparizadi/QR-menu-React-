export const formatPrice = (amount) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
};