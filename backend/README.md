# Backend Deployment Instructions

## Starting the Server

1. Ensure Node.js 18+ is installed.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   node server.js
   ```

## Testing Endpoints

### Test Users

| Role       | Email                  | Password   |
|------------|------------------------|------------|
| **Admin**  | admin@catchy.com       | Admin123!  |
| **Buyer**  | buyer@catchy.com       | Buyer123!  |
| **Seller** | seller@catchy.com      | Seller123! |
| **Delivery** | delivery@catchy.com  | Delivery123! |

### Endpoints

#### Login
- URL: `/auth/login`
- Method: POST
- Example:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"email":"buyer@catchy.com","password":"Buyer123!"}' http://localhost:3000/auth/login
  ```

#### Place Order (Buyer)
- URL: `/orders/place`
- Method: POST
- Example:
  ```bash
  curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"items":[{"product_id":"123","quantity":2}],"sellerId":"seller_uid","totalAmount":50}' http://localhost:3000/orders/place
  ```

#### Update Delivery Status (Delivery)
- URL: `/orders/update-delivery`
- Method: POST
- Example:
  ```bash
  curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"orderId":"order_id","deliveryStatus":"delivered"}' http://localhost:3000/orders/update-delivery
  ```

#### Update Order Status (Seller)
- URL: `/orders/update-status`
- Method: POST
- Example:
  ```bash
  curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"orderId":"order_id","status":"completed"}' http://localhost:3000/orders/update-status
  ```

#### Record Payment (Buyer)
- URL: `/payments/record`
- Method: POST
- Example:
  ```bash
  curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"orderId":"order_id","paymentMethod":"card","cardDetails":{"number":"4242424242424242","expiry":"12/25","cvv":"123"}}' http://localhost:3000/payments/record
  ```

## Notes
- Ensure Firebase Authentication and Firestore are properly configured.
- Use the provided test credentials for testing.
- The backend.zip file contains all necessary files for deployment.

## Optional Start Script
Run the following command to start the server easily:
```bash
start.bat
```