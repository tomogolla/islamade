/** @type {Record<string, string>} */
const redirects = {'/index.html':'/','/pages/shop.html':'/shop','/pages/collections.html':'/collections','/pages/custom.html':'/custom','/pages/about.html':'/about'};
/** @param {URL} url */
export function legacyRedirect(url){const {pathname,searchParams}=url;if(pathname==='/pages/collection.html'){const slug=searchParams.get('c');return slug?`/collections/${encodeURIComponent(slug)}`:'/collections'}const target=redirects[pathname];return target?`${target}${url.search}`:null}
