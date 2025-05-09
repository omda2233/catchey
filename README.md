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
