const money = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });

export const formatPrice = (value) => money.format(value);

export const formatQty = (qty, unit) =>
  `${qty.toLocaleString('pl-PL', { maximumFractionDigits: 2 })} ${unit}`;
