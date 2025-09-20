import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'providers/language_provider.dart';
import 'providers/theme_provider.dart';
import 'providers/auth_provider.dart';
import 'providers/cart_provider.dart';
import 'models/product_model.dart';
import 'utils/theme.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/cart_screen.dart';
import 'screens/buyer/buyer_dashboard.dart';
import 'screens/seller/seller_dashboard.dart';
import 'screens/seller/add_product_screen.dart';
import 'screens/seller/edit_product_screen.dart';
import 'screens/seller/seller_orders_screen.dart';
import 'screens/shipper/shipper_dashboard.dart';
import 'screens/delivery/delivery_dashboard.dart';
import 'screens/admin/admin_dashboard.dart';
import 'screens/payment_screen.dart';
import 'screens/checkout_screen.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        FutureProvider<LanguageProvider>(
          create: (_) => LanguageProvider.init(),
        ),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProxyProvider<AuthProvider, CartProvider>(
          create: (_) => CartProvider(),
          update: (context, auth, previous) => previous!..init(auth.user?.uid ?? ''),
        ),
      ],
      child: Consumer2<ThemeProvider, AuthProvider>(
        builder: (context, themeProvider, authProvider, _) {
          return FutureBuilder<LanguageProvider>(
            future: LanguageProvider.init(),
            builder: (context, snapshot) {
              final languageProvider = snapshot.data ?? LanguageProvider(null, const Locale('en'));
              return MaterialApp(
                title: 'Catchey',
                debugShowCheckedModeBanner: false,
                theme: AppTheme.lightTheme,
                darkTheme: AppTheme.darkTheme,
                themeMode: themeProvider.themeMode,
                locale: languageProvider.currentLocale,
                localizationsDelegates: AppLocalizations.localizationsDelegates,
                supportedLocales: AppLocalizations.supportedLocales,
                home: const SplashScreen(),
                routes: {
                  '/': (_) => SplashScreen(),
                  '/login': (_) => LoginScreen(),
                  '/signup': (_) => SignupScreen(),
                  '/cart': (_) => CartScreen(),
                  '/buyer_dashboard': (_) => BuyerDashboard(),
                  '/seller_dashboard': (_) => SellerDashboard(),
                  '/add_product': (_) => AddProductScreen(),
                  '/edit_product': (context) {
                    final product = ModalRoute.of(context)!.settings.arguments as ProductModel;
                    return EditProductScreen(product: product);
                  },
                  '/seller_orders': (_) => SellerOrdersScreen(),
                  '/shipper_dashboard': (_) => ShipperDashboard(),
                  '/delivery_dashboard': (_) => DeliveryDashboard(),
                  '/admin_dashboard': (_) => AdminDashboard(),
                  '/checkout': (_) => CheckoutScreen(),
                  '/payment': (context) {
                    final args = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
                    return PaymentScreen(
                      amount: args['amount'],
                      orderId: args['orderId'],
                      sellerId: args['sellerId'],
                    );
                  },
                },
              );
            },
          );
        },
      ),
    );
  }
}
