# Deployment Report (Final)

Release: v1.0.2-stable (backend)

This report documents the verified backend and configuration changes deployed to Railway, including Firebase connection, payment simulation, order status logic, and delivery workflow. It also includes endpoints, test users, and payment cards used for end-to-end validation.

## Overview
- Firebase Admin SDK connection verified and working for role-based tokens.
- Orders API: placement (buyer), listing (role-filtered), merchant/admin status updates, delivery status updates (delivery role).
- Payments API: payment recording for buyer with card and InstaPay methods; sets `paymentStatus` to `paid`.
- Delivery workflow: `deliveryId` assigned and `deliveryStatus` transitions accepted per role.
- Health endpoint verified.

## Base URL
- Railway: `https://catchey-copy-copy-production.up.railway.app`

## Key Endpoints
- `GET /health` — service health
- `GET /api/orders` — role-filtered orders list
- `POST /api/orders` — place order (buyer)
- `PUT /api/orders/{id}/status` — update order status (merchant/admin) — body: `{ "status": "processing" | "fulfilled" | "cancelled" }`
- `PUT /api/orders/{id}/delivery-status` — update delivery status (delivery) — body: `{ "deliveryStatus": "pending" | "in_transit" | "delivered" | "failed" }`
- `POST /api/payments` — record payment (buyer) — body: `{ "orderId", "method", "amount", ... }`

## Request Schemas (summary)
- Place order `POST /api/orders`
  - body: `{ items: [{ productId, quantity }], merchantId, amount, deliveryId? }`
- Record payment `POST /api/payments`
  - body: `{ orderId, method: "card" | "instapay", amount, cardNumber+expiryDate+cvv | instapayNumber }`
- Update order status `PUT /api/orders/{id}/status`
  - body: `{ status: "processing" | "fulfilled" | "cancelled" }` (merchant/admin)
- Update delivery status `PUT /api/orders/{id}/delivery-status`
  - body: `{ deliveryStatus: "pending" | "in_transit" | "delivered" | "failed" }` (delivery)

## Test Users
- Buyer: `buyer@test.com` / `Password123!`
- Merchant: `seller@test.com` / `Password123!`
- Delivery: `delivery@test.com` / `Password123!`
- Admin: `admin@test.com` / `Password123!`

## Test Payment Cards
- Card 1: `4242 4242 4242 4242` — Exp: `12/30` — CVV: `123`
- Card 2: `5555 5555 5555 4444` — Exp: `11/29` — CVV: `321`
- InstaPay: `instapayNumber`: `01000000000`

## Validation Flow (Summary)
1. Place order as buyer (include `merchantId` UID; optional `deliveryId`).
2. Record payment as buyer (`method=card`, include card fields).
3. Update order status as merchant (`status=processing`).
4. Assign delivery UID to order if not set (admin utility or script).
5. Update delivery status as delivery (`deliveryStatus=in_transit`).
6. Verify final state via admin list.

## Notes
- Use correct body keys: `deliveryStatus` (not `status`) for delivery updates.
- Roles are normalized: `seller` → `merchant`, `shipping` → `delivery`.
- Health check available at `GET /health`.

## Post-Deploy Confirmation
Final confirmation (commit hash, Railway deploy status, sample `orderId`, and API responses) will be provided alongside this report.