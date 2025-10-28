# Catchy Fabric Market — Deployment & Verification

## URLs
- **Backend (Render):** <RENDER_BACKEND_URL>
- **Web App (Firebase Hosting):** https://catchy-fabric-market.web.app

## Backend (Render) — Deployment Summary
- **Service type:** Web Service (Node 18)
- **Region:** EU (Frankfurt preferred)
- **Root directory:** backend
- **Start command:** npm start
- **Health endpoint:** GET /health
- **Environment variables:**
  - FIREBASE_PROJECT_ID=catchy-fabric-market
  - FIREBASE_AUTH_DOMAIN=catchy-fabric-market.firebaseapp.com
  - FIREBASE_API_KEY=AIzaSyD2x_nOR9G460pAXLu5VGD8xPFbyEY-y_Y
  - FIREBASE_MESSAGING_SENDER_ID=707075319029
  - FIREBASE_APP_ID=1:707075319029:android:bc5fe10b061ec9029211bc
  - FIREBASE_STORAGE_BUCKET=catchy-fabric-market.appspot.com
  - FIREBASE_CLIENT_EMAIL=<service-account@catchy-fabric-market.iam.gserviceaccount.com>
  - FIREBASE_PRIVATE_KEY=<-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n>

## Web (Firebase Hosting) — Deployment Summary
- **Public dir:** build/web
- **Project:** catchy-fabric-market
- **CLI:** firebase deploy --only hosting

## Verification Checklist
- [ ] Backend health check returns 200 and JSON {"status":"healthy","service":"Catchy Fabric Market Backend"}
- [ ] Web app loads over HTTPS and initializes Firebase (Analytics + Crashlytics)
- [ ] Auth: Signup, email verification, and login succeed
- [ ] Orders: Create order and verify Firestore document in orders
- [ ] Payments: Simulate card and Instapay; verify transactions/payments docs
- [ ] Delivery: Update delivery status; verify order updated
- [ ] Notifications: Firestore notifications documents created
- [ ] Logs: Render shows signup/order/payment entries

## Firestore Live Test Results
- users/: created on signup (uid=<uid>) — [Pending]
- orders/: order created (id=<orderId>) — [Pending]
- payments|transactions/: recorded (id=<paymentId>) — [Pending]
- notifications/: entries for merchant/delivery/buyer — [Pending]

## Deployment Logs (Summary)
- Render
  - [INFO] Server running on port <PORT>
  - [INFO] ✅ Authenticated user uid=<uid> role=<role>
  - [INFO] 🔥 New order: {...}
  - [INFO] 💰 Payment received: {...}
  - [INFO] Payment verified
- Firebase
  - Hosting release deployed to https://catchy-fabric-market.web.app
  - Analytics/Crashlytics collection enabled

## Next Steps (Production Hardening)
- Add CORS to Express if the web app will call the backend directly
- Set uptime checks for /health and alerting
- Map custom domain to Firebase Hosting (optional)
- Configure Render auto-redeploy from main branch
- Rotate and securely store service account key in Render
