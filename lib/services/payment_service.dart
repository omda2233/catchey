import 'package:cloud_functions/cloud_functions.dart';

class PaymentService {
  final FirebaseFunctions _functions = FirebaseFunctions.instance;

  // Process card payment (Visa/MasterCard)
  Future<Map<String, dynamic>> processCardPayment({
    required String cardNumber,
    required String expiryDate,
    required String cvv,
    required double amount,
    String? userId,
    String? orderId,
  }) async {
    try {
      final callable = _functions.httpsCallable('processCardPayment');
      final result = await callable.call({
        'cardNumber': cardNumber,
        'expiryDate': expiryDate,
        'cvv': cvv,
        'amount': amount,
        'userId': userId,
        'orderId': orderId,
      });
      
      return result.data as Map<String, dynamic>;
    } catch (e) {
      throw 'Error processing card payment: ${e.toString()}';
    }
  }

  // Process Instapay payment
  Future<Map<String, dynamic>> processInstapayPayment({
    required String instapayNumber,
    required double amount,
    String? userId,
    String? orderId,
  }) async {
    try {
      final callable = _functions.httpsCallable('processInstapayPayment');
      final result = await callable.call({
        'instapayNumber': instapayNumber,
        'amount': amount,
        'userId': userId,
        'orderId': orderId,
      });
      
      return result.data as Map<String, dynamic>;
    } catch (e) {
      throw 'Error processing Instapay payment: ${e.toString()}';
    }
  }










  // Validate card number format
  static bool isValidCardNumber(String cardNumber) {
    // Remove spaces and dashes
    final cleanNumber = cardNumber.replaceAll(RegExp(r'[\s-]'), '');
    
    // Check if it's numeric and has correct length
    if (!RegExp(r'^\d+$').hasMatch(cleanNumber)) return false;
    if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;
    
    return true;
  }

  // Validate expiry date format
  static bool isValidExpiryDate(String expiryDate) {
    final regex = RegExp(r'^(0[1-9]|1[0-2])\/([0-9]{2})$');
    if (!regex.hasMatch(expiryDate)) return false;
    
    final parts = expiryDate.split('/');
    final month = int.parse(parts[0]);
    final year = int.parse('20${parts[1]}');
    
    final now = DateTime.now();
    final expiry = DateTime(year, month);
    
    return expiry.isAfter(now);
  }

  // Validate CVV
  static bool isValidCVV(String cvv) {
    return RegExp(r'^\d{3,4}$').hasMatch(cvv);
  }

  // Validate Instapay number
  static bool isValidInstapayNumber(String instapayNumber) {
    return RegExp(r'^01[0-9]{9}$').hasMatch(instapayNumber);
  }
}
