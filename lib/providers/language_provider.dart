import 'package:flutter/material.dart';
import 'package:shared_preferences.dart';

class LanguageProvider with ChangeNotifier {
  static const String _languageKey = 'language_code';
  late SharedPreferences _prefs;
  Locale _currentLocale = const Locale('en');

  LanguageProvider() {
    _loadLanguage();
  }

  Locale get currentLocale => _currentLocale;

  Future<void> _loadLanguage() async {
    _prefs = await SharedPreferences.getInstance();
    final String? languageCode = _prefs.getString(_languageKey);
    if (languageCode != null) {
      _currentLocale = Locale(languageCode);
      notifyListeners();
    }
  }

  Future<void> setLanguage(String languageCode) async {
    if (_currentLocale.languageCode != languageCode) {
      _currentLocale = Locale(languageCode);
      await _prefs.setString(_languageKey, languageCode);
      notifyListeners();
    }
  }

  bool get isEnglish => _currentLocale.languageCode == 'en';
  bool get isArabic => _currentLocale.languageCode == 'ar';

  void toggleLanguage() {
    setLanguage(isEnglish ? 'ar' : 'en');
  }
} 