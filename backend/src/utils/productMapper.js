/** Maps shop filter keys → product.category values (frontend CATEGORY_MAP) */
export const CATEGORY_MAP = {
  Laptops: ["Laptops"],
  Phones: ["Smartphones"],
  Audio: ["Audio"],
  Tablets: ["Tablets"],
  Wearables: ["Wearables"],
  Cameras: ["Cameras", "Photography"],
  Accessories: ["Accessories", "Storage"],
};

export function toProductResponse(product) {
  const doc = typeof product.toObject === "function" ? product.toObject() : product;

  return {
    id: doc.slug,
    slug: doc.slug,
    _id: doc._id,
    name: doc.name,
    category: doc.category,
    brand: doc.brand,
    price: doc.price,
    rating: doc.rating,
    reviews: doc.reviews,
    image: doc.image,
    badge: doc.badge,
    description: doc.description,
    colors: [],
    storageOptions: doc.storageOptions,
    gallery: doc.gallery,
    features: doc.features,
    monthlyPrice: doc.monthlyPrice,
    isFeatured: doc.isFeatured,
    isShop: doc.isShop,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export function toCategoryResponse(category) {
  const doc = typeof category.toObject === "function" ? category.toObject() : category;

  return {
    id: doc.slug,
    slug: doc.slug,
    _id: doc._id,
    label: doc.label,
    filterKey: doc.filterKey,
    productCategories: doc.productCategories,
    tag: doc.tag,
    title: doc.title,
    description: doc.description,
    image: doc.image,
  };
}

function parseList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildProductQuery(query = {}) {
  const filter = {};

  if (query.featured === "true" || query.isFeatured === "true") {
    filter.isFeatured = true;
  }

  if (query.shop === "true" || query.isShop === "true") {
    filter.isShop = true;
  }

  const brands = parseList(query.brand || query.brands);
  if (brands.length > 0) {
    filter.brand = { $in: brands };
  }

  const categories = parseList(query.category || query.categories);
  if (categories.length > 0) {
    const productCategories = categories.flatMap(
      (key) => CATEGORY_MAP[key] || [key]
    );
    filter.category = { $in: [...new Set(productCategories)] };
  }

  if (query.maxPrice !== undefined && query.maxPrice !== "") {
    const maxPrice = Number(query.maxPrice);
    if (!Number.isNaN(maxPrice)) {
      filter.price = { ...(filter.price || {}), $lte: maxPrice };
    }
  }

  if (query.minPrice !== undefined && query.minPrice !== "") {
    const minPrice = Number(query.minPrice);
    if (!Number.isNaN(minPrice)) {
      filter.price = { ...(filter.price || {}), $gte: minPrice };
    }
  }

  if (query.minRating !== undefined && query.minRating !== "") {
    const minRating = Number(query.minRating);
    if (!Number.isNaN(minRating) && minRating > 0) {
      filter.rating = { $gte: minRating };
    }
  }

  const search = (query.search || query.q || "").trim();
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  return filter;
}

export function getProductSort(sort) {
  switch (sort) {
    case "price-asc":
      return { price: 1 };
    case "price-desc":
      return { price: -1 };
    case "rating":
      return { rating: -1 };
    case "featured":
    default:
      return { isFeatured: -1, createdAt: -1 };
  }
}
