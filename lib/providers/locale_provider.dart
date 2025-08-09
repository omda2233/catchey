import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LocaleProvider with ChangeNotifier {
  Locale _locale = Locale('en');

  Locale get locale => _locale;

  LocaleProvider() {
    _loadLocale();
  }

  void setLocale(Locale locale) async {
    _locale = locale;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    prefs.setString('locale', locale.languageCode);
  }

  void toggleLocale() {
    if (_locale.languageCode == 'en') {
      setLocale(Locale('ar'));
    } else {
      setLocale(Locale('en'));
    }
  }

  void _loadLocale() async {
    final prefs = await SharedPreferences.getInstance();
    String? code = prefs.getString('locale');
    if (code != null) {
      _locale = Locale(code);
      notifyListeners();
    }
  }
} 