import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeProvider with ChangeNotifier {
  static const String _themeKey = 'theme_mode';
  final SharedPreferences _prefs;
  ThemeMode _themeMode;

  ThemeProvider._(this._prefs, this._themeMode);

  static Future<ThemeProvider> init() async {
    final prefs = await SharedPreferences.getInstance();
    final savedTheme = prefs.getString(_themeKey);
    final themeMode = savedTheme != null
        ? ThemeMode.values.firstWhere(
            (mode) => mode.toString() == savedTheme,
            orElse: () => ThemeMode.system,
          )
        : ThemeMode.system;
    return ThemeProvider._(prefs, themeMode);
  }

  ThemeMode get themeMode => _themeMode;

  Future<void> setThemeMode(ThemeMode mode) async {
    if (_themeMode == mode) return;

    _themeMode = mode;
    await _prefs.setString(_themeKey, mode.toString());
    notifyListeners();
  }

  bool get isDarkMode =>
      _themeMode == ThemeMode.dark ||
      (_themeMode == ThemeMode.system &&
          WidgetsBinding.instance.window.platformBrightness == Brightness.dark);

  void toggleTheme() {
    setThemeMode(isDarkMode ? ThemeMode.light : ThemeMode.dark);
  }
}
