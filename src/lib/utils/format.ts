import { site } from '#lib/data/config';
export function formatPrice(price: number | null) {
  return price === null ? '' : `${site.currency} ${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
export function piecesLabel(count: number) { return `${count} ${count === 1 ? 'piece' : 'pieces'}`; }
