/**
 * @openapi
 * /cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get current user cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Cart'
 *   delete:
 *     tags: [Cart]
 *     summary: Clear cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */

/**
 * @openapi
 * /cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productSlug]
 *             properties:
 *               productSlug: { type: string, example: shop-iphone-15-pro-max }
 *               qty: { type: integer, minimum: 1, default: 1 }
 *     responses:
 *       200:
 *         description: Item added
 *       404:
 *         description: Product not found
 */

/**
 * @openapi
 * /cart/items/{id}:
 *   put:
 *     tags: [Cart]
 *     summary: Update cart item qty
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Product slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [qty]
 *             properties:
 *               qty: { type: integer, example: 2 }
 *     responses:
 *       200:
 *         description: Cart updated
 *   delete:
 *     tags: [Cart]
 *     summary: Remove cart item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Product slug
 *     responses:
 *       200:
 *         description: Item removed
 */

/**
 * @openapi
 * /wishlist:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist fetched
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
 *                             $ref: '#/components/schemas/WishlistItem'
 *                         count: { type: integer }
 */

/**
 * @openapi
 * /wishlist/items:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add item to wishlist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productSlug]
 *             properties:
 *               productSlug: { type: string, example: macbook-air-m3 }
 *     responses:
 *       200:
 *         description: Item added
 */

/**
 * @openapi
 * /wishlist/toggle:
 *   post:
 *     tags: [Wishlist]
 *     summary: Toggle wishlist item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productSlug]
 *             properties:
 *               productSlug: { type: string }
 *     responses:
 *       200:
 *         description: Toggled
 */

/**
 * @openapi
 * /wishlist/items/{id}:
 *   delete:
 *     tags: [Wishlist]
 *     summary: Remove wishlist item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Product slug
 *     responses:
 *       200:
 *         description: Item removed
 */

/**
 * @openapi
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: List current user orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders list
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
 *                         orders:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Order'
 *                         count: { type: integer }
 *   post:
 *     tags: [Orders]
 *     summary: Place order from cart after Stripe payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [shipping, paymentIntentId]
 *             properties:
 *               shipping:
 *                 $ref: '#/components/schemas/Shipping'
 *               paymentIntentId:
 *                 type: string
 *                 example: pi_3abc123
 *     responses:
 *       201:
 *         description: Order placed (cart cleared)
 *       400:
 *         description: Cart empty, invalid shipping, or payment mismatch
 *       402:
 *         description: Payment not completed
 */

/**
 * @openapi
 * /payments/config:
 *   get:
 *     tags: [Payments]
 *     summary: Get Stripe publishable key
 *     responses:
 *       200:
 *         description: Publishable key
 */

/**
 * @openapi
 * /payments/create-intent:
 *   post:
 *     tags: [Payments]
 *     summary: Create Stripe PaymentIntent for current cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: clientSecret returned
 *       400:
 *         description: Cart empty
 */

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: TS-44589 }
 *         description: Order id with or without #
 *     responses:
 *       200:
 *         description: Order fetched
 *       404:
 *         description: Not found
 */

/**
 * @openapi
 * /contact:
 *   post:
 *     tags: [Contact]
 *     summary: Submit contact form
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, subject, message]
 *             properties:
 *               fullName: { type: string, example: Hamza Aziz }
 *               email: { type: string, format: email }
 *               subject:
 *                 type: string
 *                 enum:
 *                   - Technical Inquiry
 *                   - Order Support
 *                   - Project Consultation
 *                   - Corporate & Bulk Orders
 *               message: { type: string, example: Need help with my order }
 *     responses:
 *       201:
 *         description: Message sent
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
 *                         contact:
 *                           $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Validation error
 */
