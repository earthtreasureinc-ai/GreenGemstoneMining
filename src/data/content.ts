// Placeholder images from Pexels — these will be replaced when the user uploads their own photos

export const PLACEHOLDER = {
  heroMain: 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1600',
  heroSecondary: 'https://images.pexels.com/photos/17486897/pexels-photo-17486897.jpeg?auto=compress&cs=tinysrgb&w=800',
  collection1: 'https://images.pexels.com/photos/32988525/pexels-photo-32988525.jpeg?auto=compress&cs=tinysrgb&w=800',
  collection2: 'https://images.pexels.com/photos/36536888/pexels-photo-36536888.png?auto=compress&cs=tinysrgb&w=800',
  collection3: 'https://images.pexels.com/photos/32988539/pexels-photo-32988539.jpeg?auto=compress&cs=tinysrgb&w=800',
  craftMain: 'https://images.pexels.com/photos/18425415/pexels-photo-18425415.jpeg?auto=compress&cs=tinysrgb&w=1200',
  craftSecondary: 'https://images.pexels.com/photos/34022882/pexels-photo-34022882.jpeg?auto=compress&cs=tinysrgb&w=600',
  gallery1: 'https://images.pexels.com/photos/37942948/pexels-photo-37942948.jpeg?auto=compress&cs=tinysrgb&w=600',
  gallery2: 'https://images.pexels.com/photos/35451978/pexels-photo-35451978.jpeg?auto=compress&cs=tinysrgb&w=600',
  gallery3: 'https://images.pexels.com/photos/37942949/pexels-photo-37942949.jpeg?auto=compress&cs=tinysrgb&w=600',
  gallery4: 'https://images.pexels.com/photos/37924951/pexels-photo-37924951.jpeg?auto=compress&cs=tinysrgb&w=600',
  gallery5: 'https://images.pexels.com/photos/35451979/pexels-photo-35451979.jpeg?auto=compress&cs=tinysrgb&w=600',
  gallery6: 'https://images.pexels.com/photos/6614317/pexels-photo-6614317.jpeg?auto=compress&cs=tinysrgb&w=600',
  testimonial1: 'https://images.pexels.com/photos/33417644/pexels-photo-33417644.jpeg?auto=compress&cs=tinysrgb&w=400',
  testimonial2: 'https://images.pexels.com/photos/30249379/pexels-photo-30249379.jpeg?auto=compress&cs=tinysrgb&w=400',
  testimonial3: 'https://images.pexels.com/photos/36647204/pexels-photo-36647204.jpeg?auto=compress&cs=tinysrgb&w=400',
};

export interface Product {
  id: string;
  name: string;
  category: 'Rings' | 'Necklaces' | 'Earrings' | 'Bracelets';
  price: number;
  image: string;
  description: string;
  gemstone: string;
  origin: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aurora Emerald Ring',
    category: 'Rings',
    price: 4800,
    image: 'https://images.pexels.com/photos/36536888/pexels-photo-36536888.png?auto=compress&cs=tinysrgb&w=800',
    description: 'A vivid Colombian emerald cradled in 18k recycled gold, framed by conflict-free diamond pavé.',
    gemstone: 'Colombian Emerald — 2.4ct',
    origin: 'Muzo Mine, Colombia',
  },
  {
    id: '2',
    name: 'Verdant Cascade Necklace',
    category: 'Necklaces',
    price: 12500,
    image: 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'A flowing pendant of emeralds and diamonds, each stone hand-selected for its depth of green.',
    gemstone: 'Zambian Emerald — 5.1ct total',
    origin: 'Kagem Mine, Zambia',
  },
  {
    id: '3',
    name: 'Jade Drop Earrings',
    category: 'Earrings',
    price: 3200,
    image: 'https://images.pexels.com/photos/17486897/pexels-photo-17486897.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Teardrop green beryl suspended from delicate gold chains, catching light with every movement.',
    gemstone: 'Green Beryl — 3.2ct pair',
    origin: 'Nigeria',
  },
  {
    id: '4',
    name: 'Forest Light Bracelet',
    category: 'Bracelets',
    price: 5600,
    image: 'https://images.pexels.com/photos/31642922/pexels-photo-31642922.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'A tennis bracelet of alternating emeralds and diamonds, a river of green across the wrist.',
    gemstone: 'Emerald — 8.6ct total',
    origin: 'Brazil',
  },
  {
    id: '5',
    name: 'Malachite Signet Ring',
    category: 'Rings',
    price: 2400,
    image: 'https://images.pexels.com/photos/32786085/pexels-photo-32786085.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'A bold malachite cabochon set in a hand-engraved gold signet — heritage meets modern design.',
    gemstone: 'Malachite — 4.0ct',
    origin: 'Democratic Republic of Congo',
  },
  {
    id: '6',
    name: 'Emerald Heritage Necklace',
    category: 'Necklaces',
    price: 8900,
    image: 'https://images.pexels.com/photos/32988525/pexels-photo-32988525.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'A statement collar of emerald beads with a diamond-encrusted clasp, timeless and bold.',
    gemstone: 'Colombian Emerald Beads',
    origin: 'Coscuez Mine, Colombia',
  },
  {
    id: '7',
    name: 'Verdant Bloom Earrings',
    category: 'Earrings',
    price: 4100,
    image: 'https://images.pexels.com/photos/31653013/pexels-photo-31653013.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Floral-inspired studs with emerald centers and diamond petals, a garden for the ear.',
    gemstone: 'Colombian Emerald — 1.8ct pair',
    origin: 'Muzo Mine, Colombia',
  },
  {
    id: '8',
    name: 'Tsavorite Tennis Bracelet',
    category: 'Bracelets',
    price: 7200,
    image: 'https://images.pexels.com/photos/8306529/pexels-photo-8306529.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'A vibrant tsavorite garnet tennis bracelet, each stone a flash of electric green fire.',
    gemstone: 'Tsavorite Garnet — 12.0ct total',
    origin: 'Merelani Hills, Tanzania',
  },
];

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Isabella Moreau',
    role: 'Art Collector, Paris',
    quote:
      'The Aurora ring captured a green I have never seen before — like sunlight filtered through a rainforest canopy. Verdantia understands that a gemstone is a piece of the earth\'s poetry.',
    image: PLACEHOLDER.testimonial1,
  },
  {
    id: '2',
    name: 'Sebastian Hartwell',
    role: 'Gallery Owner, London',
    quote:
      'I commissioned a bespoke piece for our anniversary. The craftsmanship is extraordinary — every facet tells a story. This is jewelry as fine art.',
    image: PLACEHOLDER.testimonial2,
  },
  {
    id: '3',
    name: 'Amara Okafor',
    role: 'Creative Director, Milan',
    quote:
      'Their ethical sourcing is not a marketing tag — it is woven into everything they do. Beauty without compromise. I wear my Verdantia pieces every day.',
    image: PLACEHOLDER.testimonial3,
  },
];
