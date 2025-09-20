import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import '../providers/auth_provider.dart' as app_auth;
import '../utils/theme.dart';
import '../models/user_model.dart';

class VerifyEmailScreen extends StatefulWidget {
  const VerifyEmailScreen({super.key});

  @override
  State<VerifyEmailScreen> createState() => _VerifyEmailScreenState();
}

class _VerifyEmailScreenState extends State<VerifyEmailScreen> {
  bool _isResending = false;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    // Start a timer to periodically check email verification status
    _timer = Timer.periodic(const Duration(seconds: 3), (timer) async {
      await FirebaseAuth.instance.currentUser?.reload();
      final user = FirebaseAuth.instance.currentUser;
      if (user?.emailVerified ?? false) {
        timer.cancel();
        if (mounted) {
          final authProvider = context.read<app_auth.AuthProvider>();
          // Navigate based on user role
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
        }
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _resendVerificationEmail() async {
    if (_isResending) return;
    setState(() {
      _isResending = true;
    });

    final authProvider = context.read<app_auth.AuthProvider>();
    await authProvider.resendVerificationEmail();

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            authProvider.error ?? AppLocalizations.of(context)!.otpSent,
          ),
          backgroundColor: authProvider.error != null ? Colors.red : Colors.green,
        ),
      );
      setState(() {
        _isResending = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.verifyEmail),
        automaticallyImplyLeading: false,
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Icon(
                Icons.mark_email_read_outlined,
                size: 100,
                color: Theme.of(context).primaryColor,
              ),
              const SizedBox(height: 32),
              Text(
                l10n.verifyEmail,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                l10n.otpSent,
                style: Theme.of(context).textTheme.titleMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              ElevatedButton(
                onPressed: _isResending ? null : _resendVerificationEmail,
                child: _isResending
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : Text(l10n.resendCode),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () {
                  context.read<app_auth.AuthProvider>().signOut();
                  Navigator.of(context).pushNamedAndRemoveUntil(
                    '/login',
                    (route) => false,
                  );
                },
                child: Text(l10n.back),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
