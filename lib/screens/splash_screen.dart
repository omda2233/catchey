import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import '../providers/auth_provider.dart';
import '../utils/theme.dart';
import '../models/user_model.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      if (authProvider.isAuthenticated) {
        switch (authProvider.userRole) {
          case UserRole.admin:
            Navigator.of(context).pushReplacementNamed('/admin_dashboard');
            break;
          case UserRole.seller:
            Navigator.of(context).pushReplacementNamed('/seller_dashboard');
            break;
          case UserRole.delivery:
            Navigator.of(context).pushReplacementNamed('/delivery_dashboard');
            break;
          case UserRole.shipper:
            Navigator.of(context).pushReplacementNamed('/shipper_dashboard');
            break;
          default:
            Navigator.of(context).pushReplacementNamed('/buyer_dashboard');
            break;
        }
      } else {
        Navigator.of(context).pushReplacementNamed('/login');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/images/catchy_logo.png',
              width: 200,
              height: 200,
            ),
            const SizedBox(height: 24),
            Text(
              AppLocalizations.of(context)!.appName,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    color: AppTheme.primaryColor,
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 24),
            const CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(AppTheme.accentColor),
            ),
          ],
        ),
      ),
    );
  }
}
