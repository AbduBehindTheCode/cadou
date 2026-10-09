export type ProductStatus = 'available' | 'reserved';
export type DeliveryType = 'small_travel_item' | 'large_home_delivery' | 'europe_only' | 'general';

export type Product = {
  id: string;
  name: string;
  image_url: string;
  product_url: string;
  description: string;
  short_note: string;
  status: ProductStatus;
  reserved_by: string | null;
  reserved_at: string | null;
  delivery_type: DeliveryType;
  delivery_note: string;
  created_at: string;
  updated_at: string;
};

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Boutique Crib Set',
    image_url:
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80',
    product_url: 'https://example.com/product-1',
    description:
      'A soft pastel crib set made with breathable cotton, perfect for a cozy nursery setup.',
    short_note: 'Soft and calming for the nursery.',
    status: 'available',
    reserved_by: null,
    reserved_at: null,
    delivery_type: 'large_home_delivery',
    delivery_note:
      'Large item. It can only be delivered to our home, or purchased in Europe if needed.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Baby Stroller',
    image_url:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80',
    product_url: 'https://example.com/product-2',
    description:
      'A lightweight stroller with easy folding, comfortable padding, and a smooth daily ride.',
    short_note: 'Everyday comfort for easy walks.',
    status: 'reserved',
    reserved_by: 'Sara',
    reserved_at: new Date().toISOString(),
    delivery_type: 'europe_only',
    delivery_note:
      'This item is best purchased from Europe or delivered to our home, depending on availability.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Tiny Plush Toys',
    image_url:
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80',
    product_url: 'https://example.com/product-3',
    description:
      'A set of tiny soft toys in gentle colors for the baby room, travel bag, and cuddle time.',
    short_note: 'Easy to carry from Tunisia with the flight.',
    status: 'available',
    reserved_by: null,
    reserved_at: null,
    delivery_type: 'small_travel_item',
    delivery_note:
      'Small item. We can carry this from Tunisia on the flight without any problem.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
