import test from 'node:test';
import assert from 'node:assert/strict';
import productsJson from '../data/products.json' with { type: 'json' };
import collectionsJson from '../data/collections.json' with { type: 'json' };
import { legacyRedirect } from '../src/lib/utils/legacy.js';

const products = productsJson.products;
const collections = collectionsJson.collections;

test('every product belongs to a known collection', () => {
  const ids = new Set(collections.map((collection) => collection.id));
  assert.ok(products.length > 0);
  for (const product of products) assert.ok(ids.has(product.collection), product.id);
});

test('visible collections are non-empty', () => {
  const visible = collections.filter((collection) => products.some((product) => product.collection === collection.id));
  for (const collection of visible) assert.ok(products.some((product) => product.collection === collection.id));
});

test('legacy collection URLs preserve the slug', () => {
  assert.equal(legacyRedirect(new URL('https://example.com/pages/collection.html?c=tiny-treasures')), '/collections/tiny-treasures');
});

test('legacy shop URLs preserve query parameters', () => {
  assert.equal(legacyRedirect(new URL('https://example.com/pages/shop.html?collection=at-the-sea')), '/shop?collection=at-the-sea');
  assert.equal(legacyRedirect(new URL('https://example.com/shop')), null);
});
