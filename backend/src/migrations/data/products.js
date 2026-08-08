import { buildProductDetails } from "./productDetails.js";

/** Raw catalog mirrored from frontend products.ts */
const shopProducts = [
  {
    slug: "shop-iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    category: "Smartphones",
    brand: "Apple",
    price: 1199,
    rating: 0,
    reviews: 0,
    image: "/featured_innovation/iphone_15promax.jpeg",
    isShop: true,
  },
  {
    slug: "shop-sony-wh-1000xm5",
    name: "Sony WH-1000XM5",
    category: "Audio",
    brand: "Sony",
    price: 398,
    rating: 0,
    reviews: 0,
    image: "/shop/sony_wh.webp",
    isShop: true,
  },
  {
    slug: "shop-macbook-pro-16",
    name: 'MacBook Pro 16" M3 Max',
    category: "Laptops",
    brand: "Apple",
    price: 2499,
    rating: 0,
    reviews: 0,
    image: "/cart/pro_16.svg",
    isShop: true,
  },
  {
    slug: "shop-ipad-pro-12",
    name: 'iPad Pro 12.9"',
    category: "Tablets",
    brand: "Apple",
    price: 1099,
    rating: 0,
    reviews: 0,
    image: "/shop/iPad_pro.webp",
    isShop: true,
  },
  {
    slug: "shop-galaxy-watch-6-pro",
    name: "Galaxy Watch 6 Pro",
    category: "Wearables",
    brand: "Samsung",
    price: 449,
    rating: 0,
    reviews: 0,
    image: "/shop/galaxy_8.jpg",
    isShop: true,
  },
  {
    slug: "shop-fujifilm-x100v",
    name: "Fujifilm X100V",
    category: "Photography",
    brand: "Fujifilm",
    price: 1399,
    rating: 0,
    reviews: 0,
    image: "/shop/fujifilm.webp",
    isShop: true,
  },
  {
    slug: "shop-logitech-g-pro-x",
    name: "Logitech G Pro X",
    category: "Accessories",
    brand: "Logitech",
    price: 149,
    rating: 0,
    reviews: 0,
    image: "/shop/logitech_gpro.webp",
    isShop: true,
  },
  {
    slug: "shop-samsung-t7-ssd",
    name: "Samsung T7 SSD 2TB",
    category: "Storage",
    brand: "Samsung",
    price: 179,
    rating: 0,
    reviews: 0,
    image: "/shop/samsung_t7.jpg",
    isShop: true,
  },
];

const featuredProducts = [
  {
    slug: "iphone-15-pro",
    name: "iPhone 15 Pro",
    category: "Smartphones",
    brand: "Apple",
    price: 999,
    rating: 0,
    reviews: 0,
    image: "/featured_innovation/iphone_15pro.jpg",
    badge: "BEST SELLER",
    isFeatured: true,
  },
  {
    slug: "sony-wh-1000xm5-f",
    name: "Sony WH-1000XM5",
    category: "Audio",
    brand: "Sony",
    price: 349.99,
    rating: 0,
    reviews: 0,
    image: "/featured_innovation/Sony_WH.jpeg",
    isFeatured: true,
  },
  {
    slug: "apple-watch-series-9",
    name: "Apple Watch Series 9",
    category: "Wearables",
    brand: "Apple",
    price: 399,
    rating: 0,
    reviews: 0,
    image: "/featured_innovation/Apple_Watch.svg",
    isFeatured: true,
  },
  {
    slug: "canon-eos-r6-f",
    name: "Canon EOS R6 Mark II",
    category: "Cameras",
    brand: "Canon",
    price: 2499,
    rating: 0,
    reviews: 0,
    image: "/featured_innovation/Canon_R6.svg",
    isFeatured: true,
  },
  {
    slug: "elite-gaming-mouse",
    name: "Elite Gaming Mouse",
    category: "Accessories",
    brand: "Logitech",
    price: 129.99,
    rating: 0,
    reviews: 0,
    image: "/featured_innovation/elite_gaming_Mouse.png",
    isFeatured: true,
  },
  {
    slug: "mechanical-pro",
    name: "Mechanical Pro",
    category: "Accessories",
    brand: "Keychron",
    price: 189,
    rating: 0,
    reviews: 0,
    image: "/featured_innovation/Mechinical_Pro.svg",
    isFeatured: true,
  },
  {
    slug: "airpods-pro",
    name: "AirPods Pro",
    category: "Audio",
    brand: "Apple",
    price: 249,
    rating: 0,
    reviews: 0,
    image: "/featured_innovation/AirPod_Pro.svg",
    isFeatured: true,
  },
  {
    slug: "macbook-air-m3",
    name: "MacBook Air M3",
    category: "Laptops",
    brand: "Apple",
    price: 1099,
    rating: 0,
    reviews: 0,
    image: "/featured_innovation/MAcBOOK_Air.svg",
    isFeatured: true,
  },
];

const homeProducts = [
  {
    slug: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    category: "Smartphones",
    brand: "Apple",
    price: 1189,
    rating: 0,
    reviews: 0,
    image: "/featured_innovation/iphone_15promax.jpeg",
    badge: "SALE",
  },
  {
    slug: "sony-wh-1000xm5",
    name: "Sony WH-1000XM5",
    category: "Audio",
    brand: "Sony",
    price: 398,
    rating: 0,
    reviews: 0,
    image: "/featured_innovation/Sony_WH.jpeg",
  },
  {
    slug: "macbook-pro-16-m3-max",
    name: 'MacBook Pro 16" M3 Max',
    category: "Laptops",
    brand: "Apple",
    price: 2499,
    rating: 0,
    reviews: 0,
    image: "/featured_innovation/MAcBOOK_Air.svg",
  },
  {
    slug: "airpods-pro-2",
    name: "AirPods Pro",
    category: "Audio",
    brand: "Apple",
    price: 249,
    rating: 0,
    reviews: 0,
    image: "/featured_innovation/AirPod_Pro.svg",
  },
  {
    slug: "apple-watch-series-9-2",
    name: "Apple Watch Series 9",
    category: "Wearables",
    brand: "Apple",
    price: 399,
    rating: 0,
    reviews: 0,
    image: "/featured_innovation/Apple_Watch.svg",
  },
  {
    slug: "canon-eos-r6",
    name: "Canon EOS R6 Mark II",
    category: "Cameras",
    brand: "Canon",
    price: 2499,
    rating: 0,
    reviews: 0,
    image: "/featured_innovation/Canon_R6.svg",
  },
];

function dedupeProducts() {
  const map = new Map();

  for (const product of [...shopProducts, ...featuredProducts, ...homeProducts]) {
    const existing = map.get(product.slug);
    if (!existing) {
      map.set(product.slug, {
        ...product,
        isShop: Boolean(product.isShop),
        isFeatured: Boolean(product.isFeatured),
      });
      continue;
    }

    map.set(product.slug, {
      ...existing,
      ...product,
      isShop: existing.isShop || Boolean(product.isShop),
      isFeatured: existing.isFeatured || Boolean(product.isFeatured),
      badge: product.badge ?? existing.badge,
    });
  }

  return [...map.values()];
}

export function getProductsSeed() {
  const base = dedupeProducts();

  return base.map((product) => {
    const details = buildProductDetails(product, base);
    return {
      ...product,
      ...details,
    };
  });
}
