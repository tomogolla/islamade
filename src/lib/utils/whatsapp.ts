import type { Collection, Product } from '#lib/data/catalog';
import { formatPrice } from './format';
import { site } from '#lib/data/config';

export const whatsappUrl = (message: string) => `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
export function productOrderUrl(product: Product, collection?: Collection) {
  const price = formatPrice(product.price);
  const from = collection ? ` from the ${collection.name} collection` : '';
  const soldOut = product.stock === 0 || product.status === 'sold out';
  const message = soldOut
    ? `Hi islamade! I saw that the "${product.name}"${price ? ` (${price})` : ''}${from} is sold out. Could you make one to order for me?`
    : `Hi islamade! I'd love to order the "${product.name}"${price ? ` (${price})` : ''}${from}. ${product.status === 'made to order' ? 'Could you make one for me?' : 'Is it still available?'}`;
  return whatsappUrl(message);
}
