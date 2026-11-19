import type { Handle } from '@sveltejs/kit/hooks';
import { legacyRedirect } from '#lib/utils/legacy';
export const handle:Handle=async({event,resolve})=>{const target=legacyRedirect(event.url);return target?new Response(null,{status:308,headers:{location:target}}):resolve(event)};
