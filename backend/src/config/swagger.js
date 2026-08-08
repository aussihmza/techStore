import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.js";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "TechStore API",
      version: "1.0.0",
      description:
        "REST API for TechStore — auth, products, categories, cart, wishlist, orders, and contact.",
    },
    servers: [
      {
        url: `http://localhost:${env.port}/api`,
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Paste the JWT from /auth/login or /auth/register",
        },
      },
      schemas: {
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
        AuthPayload: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/User" },
            token: { type: "string" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "string", example: "shop-iphone-15-pro-max" },
            slug: { type: "string" },
            name: { type: "string" },
            category: { type: "string" },
            brand: { type: "string" },
            price: { type: "number" },
            rating: { type: "number" },
            reviews: { type: "integer" },
            image: { type: "string" },
            badge: {
              type: "string",
              enum: ["SALE", "NEW", "BEST SELLER", "EDITOR'S CHOICE"],
            },
            description: { type: "string" },
            colors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  hex: { type: "string" },
                },
              },
            },
            storageOptions: { type: "array", items: { type: "string" } },
            gallery: { type: "array", items: { type: "string" } },
            features: { type: "array", items: { type: "object" } },
            monthlyPrice: { type: "number" },
            isFeatured: { type: "boolean" },
            isShop: { type: "boolean" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string" },
            slug: { type: "string" },
            label: { type: "string" },
            filterKey: { type: "string" },
            productCategories: { type: "array", items: { type: "string" } },
            tag: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            image: { type: "string" },
            productCount: { type: "integer" },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            id: { type: "string" },
            productSlug: { type: "string" },
            name: { type: "string" },
            category: { type: "string" },
            brand: { type: "string" },
            price: { type: "number" },
            rating: { type: "number" },
            reviews: { type: "integer" },
            image: { type: "string" },
            badge: { type: "string" },
            qty: { type: "integer" },
          },
        },
        Cart: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/CartItem" },
            },
            count: { type: "integer" },
            subtotal: { type: "number" },
            taxes: { type: "number" },
            total: { type: "number" },
          },
        },
        WishlistItem: {
          type: "object",
          properties: {
            id: { type: "string" },
            productSlug: { type: "string" },
            name: { type: "string" },
            category: { type: "string" },
            brand: { type: "string" },
            price: { type: "number" },
            rating: { type: "number" },
            reviews: { type: "integer" },
            image: { type: "string" },
            badge: { type: "string" },
          },
        },
        Shipping: {
          type: "object",
          required: [
            "firstName",
            "lastName",
            "email",
            "address",
            "city",
            "state",
            "zip",
          ],
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            address: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            zip: { type: "string" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "string", example: "#TS-44589" },
            orderId: { type: "string" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/CartItem" },
            },
            subtotal: { type: "number" },
            taxes: { type: "number" },
            total: { type: "number" },
            shipping: { $ref: "#/components/schemas/Shipping" },
            deliveryFrom: { type: "string" },
            deliveryTo: { type: "string" },
            placedAt: { type: "string", format: "date-time" },
          },
        },
        Contact: {
          type: "object",
          properties: {
            id: { type: "string" },
            fullName: { type: "string" },
            email: { type: "string" },
            subject: { type: "string" },
            message: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    tags: [
      { name: "Health" },
      { name: "Auth" },
      { name: "Users" },
      { name: "Products" },
      { name: "Categories" },
      { name: "Cart" },
      { name: "Wishlist" },
      { name: "Orders" },
      { name: "Payments" },
      { name: "Contact" },
    ],
  },
  apis: ["./src/docs/**/*.js", "./src/routes/**/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
