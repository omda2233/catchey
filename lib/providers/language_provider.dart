import 'package:flutter/material.dart';
import 'package:shared_preferences.dart';

class LanguageProvider with ChangeNotifier {
  static const String _languageKey = 'language';
  final SharedPreferences _prefs;
  Locale _currentLocale;

  LanguageProvider() : _prefs = SharedPreferences.getInstance() as SharedPreferences {
    final savedLanguage = _prefs.getString(_languageKey);
    _currentLocale = savedLanguage != null
        ? Locale(savedLanguage)
        : const Locale('en'); // Default to English
  }

  Locale get currentLocale => _currentLocale;

  Future<void> setLocale(Locale locale) async {
    if (_currentLocale == locale) return;

    _currentLocale = locale;
    await _prefs.setString(_languageKey, locale.languageCode);
    notifyListeners();
  }

  bool get isEnglish => _currentLocale.languageCode == 'en';
  bool get isArabic => _currentLocale.languageCode == 'ar';

  void toggleLanguage() {
    setLocale(isEnglish ? const Locale('ar') : const Locale('en'));
  }
} 