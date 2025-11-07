# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/10927b9a-49a0-44b4-b14e-e35718f5eb0b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/10927b9a-49a0-44b4-b14e-e35718f5eb0b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/10927b9a-49a0-44b4-b14e-e35718f5eb0b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
# Catchey - E-commerce Marketplace

Catchey is a Flutter-based e-commerce marketplace application that connects buyers, sellers, and shippers. The platform supports multiple user roles and provides a seamless shopping experience with features like product management, order tracking, and real-time updates.

## Features

### For Buyers
- Browse and search products
- Filter products by category, price, and availability
- Add products to cart
- Place and track orders
- View order history
- Real-time order status updates

### For Sellers
- Product management (add, edit, delete)
- Order management
- Order status updates
- Sales analytics
- Inventory tracking

### For Shippers
- Order delivery management
- Delivery status updates
- Route optimization

## Technical Stack

- **Frontend**: Flutter
- **Backend**: Firebase
  - Authentication
  - Cloud Firestore
  - Cloud Storage
- **State Management**: Provider
- **Localization**: Flutter Localization
- **Image Handling**: Image Picker

## Getting Started

### Prerequisites

- Flutter SDK (latest version)
- Dart SDK (latest version)
- Firebase account
- Android Studio / VS Code with Flutter extensions

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/catchey.git
   cd catchey
   ```

2. Install dependencies:
   ```bash
   flutter pub get
   ```

3. Configure Firebase:
   - Create a new Firebase project
   - Add Android and iOS apps to your Firebase project
   - Download and add the configuration files:
     - `google-services.json` for Android
     - `GoogleService-Info.plist` for iOS

4. Run the app:
   ```bash
   flutter run
   ```

## Project Structure

```
lib/
├── l10n/                 # Localization files
├── models/              # Data models
├── providers/           # State management
├── screens/             # UI screens
│   ├── admin/          # Admin screens
│   ├── buyer/          # Buyer screens
│   ├── seller/         # Seller screens
│   └── shipper/        # Shipper screens
├── services/            # Firebase services
├── utils/              # Utility functions
└── widgets/            # Reusable widgets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Flutter team for the amazing framework
- Firebase for the backend services
- All contributors who have helped shape this project

## Backend Deployment (Railway)

The backend is ready for Railway deployment with the following configuration:

### Railway Settings
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Environment Variables Required
```env
PORT=3000
FIREBASE_PROJECT_ID=catchy-fabric-market
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@catchy-fabric-market.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=catchy-fabric-market.appspot.com
```

### Health Check
After deployment, verify the backend is running:
```
GET https://<railway-url>/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Catchy Fabric Market Backend",
  "time": "2025-11-04T..."
}
```

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication  
- `POST /api/orders` - Place orders (buyer role)
- `PUT /api/orders/:id/status` - Update order status (merchant/admin)
- `PUT /api/orders/:id/delivery-status` - Update delivery status (delivery role)
- `POST /api/payments` - Record payments (buyer role)