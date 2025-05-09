import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../widgets/custom_loader.dart';
import '../widgets/custom_button.dart';
import '../providers/locale_provider.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class SignupScreen extends StatefulWidget {
  @override
  _SignupScreenState createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _formKey = GlobalKey<FormState>();
  String _name = '';
  String _email = '';
  String _password = '';

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final localeProvider = Provider.of<LocaleProvider>(context);
    final isRTL = localeProvider.locale.languageCode == 'ar';
    final local = AppLocalizations.of(context);

    return Directionality(
      textDirection: isRTL ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        appBar: AppBar(title: Text(local?.signup ?? 'Sign Up')),
        body: authProvider.isLoading
            ? CustomLoader()
            : Padding(
                padding: const EdgeInsets.all(24.0),
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      TextFormField(
                        decoration: InputDecoration(labelText: local?.profile ?? 'Name'),
                        onChanged: (val) => _name = val,
                        validator: (val) => val != null && val.isNotEmpty ? null : local?.profile ?? 'Name',
                      ),
                      SizedBox(height: 16),
                      TextFormField(
                        decoration: InputDecoration(labelText: local?.email ?? 'Email'),
                        onChanged: (val) => _email = val,
                        validator: (val) => val != null && val.contains('@') ? null : local?.email ?? 'Email',
                      ),
                      SizedBox(height: 16),
                      TextFormField(
                        decoration: InputDecoration(labelText: local?.password ?? 'Password'),
                        obscureText: true,
                        onChanged: (val) => _password = val,
                        validator: (val) => val != null && val.length >= 6 ? null : local?.password ?? 'Password',
                      ),
                      SizedBox(height: 24),
                      if (authProvider.error != null)
                        Text(authProvider.error!, style: TextStyle(color: Colors.red)),
                      SizedBox(height: 8),
                      CustomButton(
                        text: local?.signup ?? 'Sign Up',
                        onPressed: () {
                          if (_formKey.currentState!.validate()) {
                            authProvider.signup(_email, _password, _name);
                          }
                        },
                      ),
                      SizedBox(height: 16),
                      TextButton(
                        onPressed: () => Navigator.pushNamed(context, '/login'),
                        child: Text(local?.login ?? 'Login'),
                      ),
                    ],
                  ),
                ),
              ),
      ),
    );
  }
} 