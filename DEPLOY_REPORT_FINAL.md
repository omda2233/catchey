# Catchy Fabric Market — Deployment Readiness Report

Generated: 2025-11-09

## Backend Health
- Health: healthy (`/health`)
- Firebase: connected (`/api/test/firebase`)
- Domain: `https://catchey-copy-copy-production.up.railway.app/`

## Smoke Tests (E2E)
- Created buyer session via ID token and login endpoint
- Placed order with real `merchantId` and `deliveryId` (created via Admin SDK)
- Processed payment with method `card` (test input)
- Updated order status as merchant to `processing`
- Updated delivery status as delivery to `in_transit`
- Observed order state reflecting `paymentStatus=paid`, `deliveryStatus=in_transit`, `status=completed`

## Firestore Data Validation
- Sample IDs:
  - orders: `0jQXmr7ANbvoxnfTlx7R`
  - payments: `5fETgmfTItz5i5Lm6LIQ`
  - users: `02sTdsoGCJQ4VMJr6mbiZ4hDfeJ3`
  - notifications: `6h6dml9WgMJlitwwEYyo`

## API Documentation
- Swagger UI not available at `/api-docs` or `/docs` (received Not Found). Consider enabling Swagger in `server.js` or confirming the hosted path.

## Android Build
- VersionCode: 2 (updated in `android/local.properties`)
- VersionName: 1.0.0
- Release APK: `build/app/outputs/flutter-apk/app-release.apk`
- Size: 53.3 MB
- SHA256: `9EBBDAFE7396F299AE155B0B7609FFEB750FDE396F7C28DC7F4EF25B16A17545`

## Notes & Next Steps
- Ensure Swagger UI is wired up and publicly accessible if required.
- Validate app login and function calls in staging/prod Firebase projects.
- Distribute the release APK to QA for device testing.
- Tag release and publish artifacts to your chosen store or distribution channel.