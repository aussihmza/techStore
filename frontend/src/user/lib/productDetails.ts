import type { Product, ProductDetail, ProductFeature } from "@/types/product";
import {
  allProducts,
  catalogProducts,
  featuredProducts,
  shopCategories,
  shopProducts,
} from "@/user/lib/products";

const FEATURE_PRESETS: Record<string, ProductFeature[]> = {
  Smartphones: [
    {
      title: "A16 Bionic Chip",
      description:
        "The incredibly efficient chip powers advanced computational photography and buttery-smooth performance for everyday multitasking.",
      tone: "light",
      icon: "chip",
    },
    {
      title: "Ceramic Shield",
      description:
        "Tougher than any smartphone glass. Ceramic Shield stands up to drops with industry-leading durability.",
      tone: "dark",
      icon: "shield",
    },
    {
      title: "Dynamic Island",
      description:
        "A magical new way to interact with iPhone. Alerts and Live Activities stay front and center.",
      tone: "accent",
      icon: "island",
    },
    {
      title: "48MP Main Camera",
      description:
        "Capture incredibly detailed photos with a next-generation main camera and advanced color science.",
      tone: "media",
      icon: "camera",
    },
  ],
  Laptops: [
    {
      title: "Apple Silicon",
      description:
        "Blazing CPU and GPU performance with industry-leading power efficiency for pro workflows.",
      tone: "light",
      icon: "chip",
    },
    {
      title: "All-day Battery",
      description:
        "Go longer between charges with a battery designed for real creative and coding sessions.",
      tone: "dark",
      icon: "battery",
    },
    {
      title: "Liquid Retina Display",
      description:
        "Stunning clarity, accurate colors, and smooth refresh for design, video, and everyday work.",
      tone: "accent",
      icon: "display",
    },
    {
      title: "Pro Connectivity",
      description:
        "Thunderbolt, MagSafe, and high-speed ports keep your studio setup flexible and fast.",
      tone: "media",
      icon: "speed",
    },
  ],
  Audio: [
    {
      title: "Active Noise Canceling",
      description:
        "Industry-leading ANC blocks distractions so you can focus on music, calls, or deep work.",
      tone: "light",
      icon: "sound",
    },
    {
      title: "Premium Drivers",
      description:
        "Tuned for rich bass and crisp detail across genres — from podcasts to cinematic scores.",
      tone: "dark",
      icon: "chip",
    },
    {
      title: "All-day Comfort",
      description:
        "Lightweight build and soft cushions make long listening sessions feel effortless.",
      tone: "accent",
      icon: "battery",
    },
    {
      title: "Spatial Audio",
      description:
        "Immersive sound that tracks with your movement for a theater-like experience.",
      tone: "media",
      icon: "island",
    },
  ],
  Wearables: [
    {
      title: "Advanced Health Sensors",
      description:
        "Track heart rate, sleep, and activity with precision sensors built for everyday wellness.",
      tone: "light",
      icon: "chip",
    },
    {
      title: "Always-On Display",
      description:
        "Glanceable info stays visible without lifting your wrist — stylish and practical.",
      tone: "dark",
      icon: "display",
    },
    {
      title: "Fast Charging",
      description:
        "Quick top-ups get you back to tracking workouts and notifications in minutes.",
      tone: "accent",
      icon: "battery",
    },
    {
      title: "Fitness Insights",
      description:
        "Personalized metrics help you train smarter and recover better every week.",
      tone: "media",
      icon: "speed",
    },
  ],
  Cameras: [
    {
      title: "Full-Frame Sensor",
      description:
        "Capture more light and detail with a sensor built for pro photography and video.",
      tone: "light",
      icon: "camera",
    },
    {
      title: "In-Body Stabilization",
      description:
        "Shoot sharper handheld photos and smoother video in low light and on the move.",
      tone: "dark",
      icon: "shield",
    },
    {
      title: "Fast Autofocus",
      description:
        "Subject tracking locks on faces, eyes, and motion with reliable accuracy.",
      tone: "accent",
      icon: "speed",
    },
    {
      title: "Pro Video Ready",
      description:
        "High-bitrate recording and clean HDMI output for studio and field production.",
      tone: "media",
      icon: "display",
    },
  ],
  Photography: [
    {
      title: "Iconic Image Science",
      description:
        "Signature color and film simulations deliver beautiful results straight out of camera.",
      tone: "light",
      icon: "camera",
    },
    {
      title: "Compact Build",
      description:
        "Pocketable design without compromising optical quality or tactile controls.",
      tone: "dark",
      icon: "shield",
    },
    {
      title: "Hybrid Viewfinder",
      description:
        "Switch between optical and electronic viewing for creative flexibility.",
      tone: "accent",
      icon: "display",
    },
    {
      title: "Street Ready",
      description:
        "Quiet shutter and discreet form factor make it ideal for everyday storytelling.",
      tone: "media",
      icon: "speed",
    },
  ],
  Tablets: [
    {
      title: "M-Series Performance",
      description:
        "Desktop-class power in a slim tablet for drawing, editing, and multitasking.",
      tone: "light",
      icon: "chip",
    },
    {
      title: "Ultra Retina Display",
      description:
        "Ultra-precise color and brightness for illustration, photo review, and media.",
      tone: "dark",
      icon: "display",
    },
    {
      title: "Apple Pencil Support",
      description:
        "Pixel-perfect input with low latency for notes, sketches, and markup.",
      tone: "accent",
      icon: "speed",
    },
    {
      title: "All-day Battery",
      description:
        "Stay productive through flights, meetings, and studio sessions on one charge.",
      tone: "media",
      icon: "battery",
    },
  ],
  Accessories: [
    {
      title: "Pro-Grade Build",
      description:
        "Durable materials and precise engineering for daily desk and gaming setups.",
      tone: "light",
      icon: "shield",
    },
    {
      title: "Responsive Controls",
      description:
        "Tuned switches and sensors deliver accuracy when every click counts.",
      tone: "dark",
      icon: "speed",
    },
    {
      title: "Custom Profiles",
      description:
        "Save lighting and binding presets for work, play, and creative workflows.",
      tone: "accent",
      icon: "chip",
    },
    {
      title: "Plug & Play",
      description:
        "Works across platforms with minimal setup so you can get productive fast.",
      tone: "media",
      icon: "battery",
    },
  ],
  Storage: [
    {
      title: "Blazing Speeds",
      description:
        "Transfer large media libraries and project files in a fraction of the time.",
      tone: "light",
      icon: "speed",
    },
    {
      title: "Rugged Protection",
      description:
        "Shock-resistant design keeps your data safe on set and on the go.",
      tone: "dark",
      icon: "shield",
    },
    {
      title: "Compact Form",
      description:
        "Pocket-sized storage that fits in any kit without adding bulk.",
      tone: "accent",
      icon: "chip",
    },
    {
      title: "Cross-Platform Ready",
      description:
        "Compatible with modern USB-C workflows across laptops, consoles, and cameras.",
      tone: "media",
      icon: "display",
    },
  ],
};

const STORAGE_PRESETS: Record<string, string[]> = {
  Smartphones: ["128GB", "256GB", "512GB"],
  Laptops: ["512GB", "1TB", "2TB"],
  Audio: [],
  Wearables: ["41mm", "45mm"],
  Cameras: ["Body Only", "Kit Lens"],
  Photography: ["Body Only"],
  Tablets: ["128GB", "256GB", "512GB"],
  Accessories: [],
  Storage: ["1TB", "2TB", "4TB"],
};

const DETAIL_OVERRIDES: Record<string, Partial<ProductDetail>> = {
  "shop-iphone-15-pro-max": {
    description:
      "The iPhone 15 Pro Max. Featuring the Dynamic Island, a 48MP Main camera, and the A17 Pro chip — forged in aerospace-grade titanium with USB-C.",
  },
  "iphone-15-pro": {
    description:
      "iPhone 15 Pro. Titanium design, A17 Pro chip, and a pro camera system that elevates every shot — from portraits to cinematic video.",
  },
  "iphone-15-pro-max": {
    description:
      "iPhone 15 Pro Max with the largest Pro display yet, advanced zoom, and Action button customization for your workflow.",
  },
  "airpods-pro": {
    description:
      "AirPods Pro with Active Noise Cancellation, Adaptive Audio, and a customizable fit for immersive listening all day.",
  },
  "airpods-pro-2": {
    description:
      "Next-generation AirPods Pro with richer sound, smarter ANC, and seamless pairing across your Apple devices.",
  },
};

/** Deduped catalog of every product that can open a detail page */
export function getAllLinkableProducts(): Product[] {
  const map = new Map<string, Product>();
  for (const p of [...shopProducts, ...featuredProducts, ...allProducts, ...catalogProducts]) {
    if (!map.has(p.id)) map.set(p.id, p);
  }
  return [...map.values()];
}

export function getProductById(id: string): Product | undefined {
  return getAllLinkableProducts().find((p) => p.id === id);
}

export function getCategorySlug(category: string): string {
  const match = shopCategories.find((c) => c.productCategories.includes(category));
  return match?.slug ?? "accessories";
}

export function getCategoryLabel(category: string): string {
  const match = shopCategories.find((c) => c.productCategories.includes(category));
  return match?.label ?? category;
}

function buildGallery(product: Product): string[] {
  const sameCategory = getAllLinkableProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .map((p) => p.image);

  const gallery = [product.image, ...sameCategory.filter((img) => img !== product.image)];
  while (gallery.length < 4) {
    gallery.push(product.image);
  }
  return gallery.slice(0, 4);
}

export function getProductDetail(product: Product): ProductDetail {
  const override = DETAIL_OVERRIDES[product.id] ?? {};
  const storageOptions = STORAGE_PRESETS[product.category] ?? [];
  const features = FEATURE_PRESETS[product.category] ?? FEATURE_PRESETS.Accessories;

  return {
    description:
      override.description ??
      `${product.name} by ${product.brand}. Premium ${product.category.toLowerCase()} engineered for everyday performance, refined design, and lasting reliability.`,
    colors: [],
    storageOptions: override.storageOptions ?? storageOptions,
    gallery: override.gallery ?? buildGallery(product),
    features: override.features ?? features,
  };
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const all = getAllLinkableProducts();
  const sameCategory = all.filter((p) => p.category === product.category && p.id !== product.id);
  const others = all.filter((p) => p.category !== product.category && p.id !== product.id);

  const picked: Product[] = [];
  const seenNames = new Set<string>([product.name]);

  for (const list of [sameCategory, others]) {
    for (const p of list) {
      if (seenNames.has(p.name)) continue;
      seenNames.add(p.name);
      picked.push(p);
      if (picked.length >= limit) return picked;
    }
  }
  return picked;
}
