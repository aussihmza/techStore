/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: List products
 *     parameters:
 *       - in: query
 *         name: featured
 *         schema: { type: string, enum: ['true'] }
 *         description: Only featured products
 *       - in: query
 *         name: shop
 *         schema: { type: string, enum: ['true'] }
 *         description: Only shop catalog products
 *       - in: query
 *         name: categorySlug
 *         schema: { type: string, example: laptops }
 *       - in: query
 *         name: category
 *         schema: { type: string, example: Laptops }
 *         description: Filter key or product category (comma-separated)
 *       - in: query
 *         name: brand
 *         schema: { type: string, example: Apple }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: minRating
 *         schema: { type: number }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [featured, price-asc, price-desc, rating]
 *     responses:
 *       200:
 *         description: Products list
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         products:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Product'
 *                         count: { type: integer }
 *   post:
 *     tags: [Products]
 *     summary: Create product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slug, name, category, brand, price, image]
 *             properties:
 *               slug: { type: string }
 *               name: { type: string }
 *               category: { type: string }
 *               brand: { type: string }
 *               price: { type: number }
 *               rating: { type: number }
 *               reviews: { type: integer }
 *               image: { type: string }
 *               badge: { type: string }
 *               description: { type: string }
 *               isFeatured: { type: boolean }
 *               isShop: { type: boolean }
 *     responses:
 *       201:
 *         description: Product created
 *       409:
 *         description: Slug already exists
 */

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by slug or MongoDB id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: shop-iphone-15-pro-max }
 *     responses:
 *       200:
 *         description: Product fetched
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         product:
 *                           $ref: '#/components/schemas/Product'
 *       404:
 *         description: Not found
 *   put:
 *     tags: [Products]
 *     summary: Update product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Not found
 *   delete:
 *     tags: [Products]
 *     summary: Delete product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Not found
 */

/**
 * @openapi
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: List categories
 *     responses:
 *       200:
 *         description: Categories list
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         categories:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Category'
 *                         count: { type: integer }
 *   post:
 *     tags: [Categories]
 *     summary: Create category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slug, label, filterKey]
 *             properties:
 *               slug: { type: string }
 *               label: { type: string }
 *               filterKey: { type: string }
 *               productCategories:
 *                 type: array
 *                 items: { type: string }
 *               tag: { type: string }
 *               title: { type: string }
 *               description: { type: string }
 *               image: { type: string }
 *     responses:
 *       201:
 *         description: Category created
 */

/**
 * @openapi
 * /categories/{slug}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string, example: laptops }
 *     responses:
 *       200:
 *         description: Category fetched
 *       404:
 *         description: Not found
 */
