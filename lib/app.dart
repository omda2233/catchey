import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'providers/language_provider.dart';
import 'providers/theme_provider.dart';
import 'providers/auth_provider.dart';
import 'providers/cart_provider.dart';
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
import 'screens/admin/admin_dashboard.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LanguageProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
      ],
      child: Consumer3<LanguageProvider, ThemeProvider, AuthProvider>(
        builder: (context, languageProvider, themeProvider, authProvider, _) {
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
                final product = ModalRoute.of(context)!.settings.arguments as Product;
                return EditProductScreen(product: product);
              },
              '/seller_orders': (_) => SellerOrdersScreen(),
              '/shipper_dashboard': (_) => ShipperDashboard(),
              '/admin_dashboard': (_) => AdminDashboard(),
            },
          );
        },
      ),
    );
  }
} 