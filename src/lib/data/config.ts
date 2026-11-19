export const site = {
  name: 'islamade',
  tagline: 'handmade crochet, made with love',
  description: 'Playful crochet pieces, stitched slowly by hand in Nairobi.',
  origin: 'https://islamade.com',
  currency: 'KSh',
  email: 'hello@islamade.com',
  whatsappNumber: '254798695345',
  whatsappDisplay: '+254 798 695345',
  instagram: 'https://www.instagram.com/isla_crochets/',
  instagramHandle: '@isla_crochets',
  youtube: 'https://www.youtube.com/@isla_crochets',
  youtubeHandle: '@isla_crochets',
  showNewBadge: true
} as const;

export const navItems = [
  { href: '/collections', label: 'Collections' },
  { href: '/shop', label: 'Shop' },
  { href: '/custom', label: 'Custom orders' },
  { href: '/about', label: 'Our story' },
  { href: `mailto:${site.email}`, label: 'Contact' }
] as const;
