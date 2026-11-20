import productsJson from '../../../data/products.json';
import collectionsJson from '../../../data/collections.json';
import { asset } from '$app/paths';
import type { AssetPath } from '$app/types';

export type ProductStatus = 'available' | 'made to order' | 'sold out';
export type Accent = 'periwinkle' | 'lavender' | 'pink' | 'butter' | 'mint';

export interface Product {
  id: string; name: string; price: number | null; collection: string;
  shortDescription: string; description: string; status: ProductStatus;
  new: boolean; featured: boolean; colors: string[]; size: string;
  materials: string; stock: number | null; images: string[]; alt: string;
}
export interface Collection {
  id: string; name: string; tagline: string; description: string;
  accent: Accent; shape: string; featured: boolean; cover: string; items: number;
}

export const products = productsJson.products as Product[];
export const collections = collectionsJson.collections as Collection[];
export const visibleCollections = collections.filter((collection) => products.some((product) => product.collection === collection.id));
export const collectionMap = new Map(collections.map((collection) => [collection.id, collection]));
export const productsIn = (id: string) => products.filter((product) => product.collection === id);
export const collectionOf = (product: Product) => collectionMap.get(product.collection);
export const productStatus = (product: Product): ProductStatus => product.stock === 0 ? 'sold out' : product.status;
export const isLowStock = (product: Product) => productStatus(product) !== 'sold out' && product.stock !== null && product.stock > 0 && product.stock <= 3;
export const assetUrl = (path?: string) => {
  const publicPath = (path ?? 'assets/images/placeholders/yarn-lavender.svg')
    .replaceAll('\\', '/')
    .replace(/^\/+/, '')
    .replace(/^assets\//, '')
    .split('/')
    .map(encodeURIComponent)
    .join('/');

  return asset(publicPath as AssetPath);
};
