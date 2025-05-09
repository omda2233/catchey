import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'providers/language_provider.dart';
import 'providers/theme_provider.dart';
import 'utils/theme.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/buyer/buyer_dashboard.dart';
import 'screens/seller/seller_dashboard.dart';
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
      ],
      child: Consumer2<LanguageProvider, ThemeProvider>(
        builder: (context, languageProvider, themeProvider, _) {
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
              '/buyer_dashboard': (_) => BuyerDashboard(),
              '/seller_dashboard': (_) => SellerDashboard(),
              '/shipper_dashboard': (_) => ShipperDashboard(),
              '/admin_dashboard': (_) => AdminDashboard(),
            },
          );
        },
      ),
    );
  }
} 