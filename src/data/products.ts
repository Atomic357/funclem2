export interface Product {
  id: string;
  name: string;
  category: 'Drinkware & Coffee' | 'Power & Tech' | 'Home & Living' | 'Workspace';
  price: number;
  tagline: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  featured: boolean;
  availability: 'In Stock' | 'Low Stock' | 'Made to Order';
  bestFor: string;
  specs: string;
  benefits: {
    title: string;
    detail: string;
  }[];
  variants?: string[];
}

export const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1600086827875-a63b01f1335c?auto=format&fit=crop&w=1200&q=85';

export const STORE_WHATSAPP_NUMBER = '2348091234567';
export const STORE_DISPLAY_PHONE = '+234 809 123 4567';

export interface ThemeOption {
  id: 'emerald' | 'nordic' | 'terracotta' | 'midnight';
  name: string;
  description: string;
  previewColor: string;
  accentColor: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'emerald',
    name: 'Emerald & Forest',
    description: 'Fresh botanical pine, crisp sage & emerald accents',
    previewColor: '#0B2518',
    accentColor: '#10B981',
  },
  {
    id: 'nordic',
    name: 'Nordic Slate',
    description: 'Minimalist studio monochrome & royal cobalt',
    previewColor: '#0F172A',
    accentColor: '#2563EB',
  },
  {
    id: 'terracotta',
    name: 'Warm Terracotta',
    description: 'Artisanal sun-baked clay, warm oat & deep espresso',
    previewColor: '#2A1F1B',
    accentColor: '#C25934',
  },
  {
    id: 'midnight',
    name: 'Midnight Dark',
    description: 'Deep obsidian luxury canvas with cyber mint glow',
    previewColor: '#0A0E12',
    accentColor: '#2DD4BF',
  },
];

export const CATEGORIES: { id: string; label: string; description: string }[] = [
  {
    id: 'all',
    label: 'All Products',
    description: 'Complete collection of vetted everyday essentials',
  },
  {
    id: 'Drinkware & Coffee',
    label: 'Drinkware & Coffee',
    description: 'Thermal flasks and slow-brew tools built for daily rituals',
  },
  {
    id: 'Power & Tech',
    label: 'Power & Tech',
    description: 'Reliable portable power and cable organization without clutter',
  },
  {
    id: 'Workspace',
    label: 'Workspace',
    description: 'Cordless lighting and tactile desk organization',
  },
  {
    id: 'Home & Living',
    label: 'Home & Living',
    description: 'Quiet, durable objects that simplify routines at home',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'thermal-flask-750',
    name: 'Insulated Day Flask (750ml)',
    category: 'Drinkware & Coffee',
    price: 28500,
    tagline: 'Keeps water ice-cold for 24 hours in traffic or hot tea warm all morning.',
    description:
      'Built from food-grade 18/8 stainless steel with a powder-coated stone finish that never sweats inside your bag alongside laptops or documents.',
    imageUrl:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
    ],
    featured: true,
    availability: 'In Stock',
    bestFor: 'Commuters, gym sessions, and long workdays away from a water dispenser.',
    specs: '750ml · 18/8 Stainless Steel · Leak-proof loop lid',
    variants: ['Pine Green', 'Stone Slate', 'Matte Obsidian'],
    benefits: [
      {
        title: 'Zero condensation in your bag',
        detail: 'Double-wall vacuum insulation stops exterior sweat, keeping laptops and paperwork completely dry.',
      },
      {
        title: 'Fits standard car cupholders',
        detail: 'Tapered base slides cleanly into vehicle cupholders and backpack side pouches.',
      },
      {
        title: 'Clean taste with every sip',
        detail: 'Electropolished interior ensures pure taste and rinses free of previous tea or coffee scents.',
      },
    ],
  },
  {
    id: 'cordless-brass-lamp',
    name: 'Cordless Brass & Oak Desk Lamp',
    category: 'Workspace',
    price: 46000,
    tagline: 'Warm, glare-free reading light that keeps working for 18 hours when power goes out.',
    description:
      'A weighted brushed-brass and solid oak lamp with a built-in rechargeable battery. Move it from your study desk to your bedside without hunting for wall sockets.',
    imageUrl:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=85',
    ],
    featured: true,
    availability: 'In Stock',
    bestFor: 'Late-night reading, remote work calls, and uninterrupted light during power cuts.',
    specs: '18h Battery · USB-C Rechargeable · 3 Warmth Levels',
    variants: ['Brushed Brass & Oak', 'Matte Bronze & Walnut'],
    benefits: [
      {
        title: 'Works through power cuts',
        detail: 'High-density internal battery runs up to 18 hours on low and 8 hours on full reading brightness.',
      },
      {
        title: 'Easy on tired eyes',
        detail: 'Diffused warm-to-neutral LED ring eliminates harsh screen glare and harsh blue flicker at night.',
      },
      {
        title: 'Recharges with your phone cable',
        detail: 'Uses a standard USB-C port at the base—no proprietary adapter to lose.',
      },
    ],
  },
  {
    id: 'slim-power-bank-10k',
    name: 'Slim Anodized Power Bank (10,000mAh)',
    category: 'Power & Tech',
    price: 34000,
    tagline: 'Two full phone charges in an aluminum body thinner than a notebook.',
    description:
      'Designed for people tired of carrying heavy plastic bricks. Snaps magnetically to modern phones or charges laptops and tablets rapidly via the braided USB-C cable.',
    imageUrl:
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=1000&q=85',
    ],
    featured: true,
    availability: 'In Stock',
    bestFor: 'Travel days, back-to-back meetings, and keeping your phone alive from morning to midnight.',
    specs: '10,000mAh · 30W Fast Charge · Braided USB-C Included',
    variants: ['Titanium Gray', 'Natural Silver', 'Forest Pine'],
    benefits: [
      {
        title: 'Fast 30-minute recovery charge',
        detail: 'Brings a dead smartphone back to 55% in under 30 minutes using 30W USB-C Power Delivery.',
      },
      {
        title: 'Runs cool and safe in warm weather',
        detail: 'Machined aluminum shell dissipates heat naturally instead of trapping it inside thick plastic.',
      },
      {
        title: 'Clear percentage readout',
        detail: 'Know exactly how much backup power remains before you step out the door.',
      },
    ],
  },
  {
    id: 'borosilicate-pour-over',
    name: 'Borosilicate Pour-Over Coffee Carafe',
    category: 'Drinkware & Coffee',
    price: 32000,
    tagline: 'Brew rich, clean coffee in 3 minutes without paper filters or electricity.',
    description:
      'Hand-blown thermal shock-resistant glass paired with a laser-etched stainless steel filter and heat-safe ceramic collar for effortless daily brewing.',
    imageUrl:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85',
    ],
    featured: true,
    availability: 'In Stock',
    bestFor: 'Coffee and loose-leaf tea drinkers who want café quality at home without a bulky machine.',
    specs: '600ml (4 Cups) · Reusable Steel Filter · Thermal Glass',
    variants: ['Forest Green Collar', 'Matte Black Collar'],
    benefits: [
      {
        title: 'Never buy paper filters again',
        detail: 'Fine dual-layer stainless steel mesh lets natural coffee oils through while catching all grounds.',
      },
      {
        title: 'Safe with boiling kettle water',
        detail: 'Lab-grade borosilicate glass handles sudden temperature changes without cracking.',
      },
      {
        title: 'Rinses clean in 20 seconds',
        detail: 'Wide mouth and removable collar make emptying grounds and rinsing under the tap effortless.',
      },
    ],
  },
  {
    id: 'everyday-desk-bundle',
    name: 'The Calm Desk Starter Set',
    category: 'Home & Living',
    price: 78000,
    tagline: 'Our ceramic pour-over set, insulated flask, and solid oak tray paired at a bundle savings.',
    description:
      'Everything needed to keep your desk organized and your morning routine unhurried. Curated so every piece matches in tone, texture, and durability.',
    imageUrl:
      'https://images.unsplash.com/photo-1600086827875-a63b01f1335c?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600086827875-a63b01f1335c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=85',
    ],
    featured: true,
    availability: 'Low Stock',
    bestFor: 'Home office upgrades, thoughtful gifts, or replacing cluttered desk accessories.',
    specs: '3-Piece Set · Solid Oak Tray + Flask + Carafe Set',
    variants: ['Spruce & Oak Edition', 'Obsidian Edition'],
    benefits: [
      {
        title: 'Saves ₦11,500 compared to separate purchases',
        detail: 'Bundled pricing gives you our three most-requested daily essentials at a direct discount.',
      },
      {
        title: 'Keeps workspace surfaces tidy',
        detail: 'The milled oak catch-all tray corrals keys, pens, earbuds, and charging cables in one dedicated spot.',
      },
      {
        title: 'Gift-ready presentation',
        detail: 'Arrives in a heavy recycled presentation box ready to unbox or gift immediately.',
      },
    ],
  },
  {
    id: 'travel-power-kit',
    name: 'All-Day Commuter Power & Hydration Kit',
    category: 'Power & Tech',
    price: 58000,
    tagline: 'Pair the 10,000mAh aluminum power bank with our 750ml insulated flask for long days out.',
    description:
      'Built for professionals who spend their day moving between client visits, workspaces, and traffic—stay hydrated and fully charged without carrying heavy gear.',
    imageUrl:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
    ],
    featured: false,
    availability: 'In Stock',
    bestFor: 'Field engineers, consultants, creators, and frequent travelers across cities.',
    specs: 'Power Bank (10,000mAh) + Insulated Flask (750ml)',
    variants: ['Pine & Titanium Pair', 'Obsidian Slate Pair'],
    benefits: [
      {
        title: 'Solves the two biggest daily headaches',
        detail: 'Cold water and reliable phone battery in one lightweight carry setup.',
      },
      {
        title: 'Built to survive daily knocks',
        detail: 'Scratch-resistant anodized aluminum and powder-coated stainless steel look sharp after years of use.',
      },
      {
        title: '1-year direct replacement warranty',
        detail: 'If anything fails under normal use, message us on WhatsApp for a hassle-free swap.',
      },
    ],
  },
];

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}
