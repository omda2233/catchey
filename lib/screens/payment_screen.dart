import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/payment_service.dart';
import '../widgets/custom_button.dart';

class PaymentScreen extends StatefulWidget {
  final double amount;
  final String? orderId;
  final String? sellerId;

  const PaymentScreen({
    super.key,
    required this.amount,
    this.orderId,
    this.sellerId,
  });

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final PaymentService _paymentService = PaymentService();
  bool _isLoading = false;
  String? _error;

  // Card payment form
  final _cardFormKey = GlobalKey<FormState>();
  final _cardNumberController = TextEditingController();
  final _expiryController = TextEditingController();
  final _cvvController = TextEditingController();

  // Instapay form
  final _instapayFormKey = GlobalKey<FormState>();
  final _instapayController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    

  }

  @override
  void dispose() {
    _tabController.dispose();
    _cardNumberController.dispose();
    _expiryController.dispose();
    _cvvController.dispose();
    _instapayController.dispose();
    super.dispose();
  }

  Future<void> _processCardPayment() async {
    if (!_cardFormKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final authProvider = context.read<AuthProvider>();
      final result = await _paymentService.processCardPayment(
        cardNumber: _cardNumberController.text.trim(),
        expiryDate: _expiryController.text.trim(),
        cvv: _cvvController.text.trim(),
        amount: widget.amount,
        userId: authProvider.user?.uid,
        orderId: widget.orderId,
      );

      if (result['success'] == true) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Payment successful! Transaction ID: ${result['transactionId']}'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.pop(context, true);
        }
      } else {
        setState(() {
          _error = result['error'] ?? 'Payment failed';
        });
      }
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _processInstapayPayment() async {
    if (!_instapayFormKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final authProvider = context.read<AuthProvider>();
      final result = await _paymentService.processInstapayPayment(
        instapayNumber: _instapayController.text.trim(),
        amount: widget.amount,
        userId: authProvider.user?.uid,
        orderId: widget.orderId,
      );

      if (result['success'] == true) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Instapay payment successful! Transaction ID: ${result['transactionId']}'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.pop(context, true);
        }
      } else {
        setState(() {
          _error = result['error'] ?? 'Payment failed';
        });
      }
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Payment'),
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(text: 'Card Payment'),
            Tab(text: 'Instapay'),
          ],
        ),
      ),
      body: Column(
        children: [
          // Payment amount display
          Container(
            width: double.infinity,
            padding: EdgeInsets.all(16),
            margin: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: theme.primaryColor.withAlpha(26),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: theme.primaryColor.withAlpha(77)),
            ),
            child: Column(
              children: [
                Text(
                  'Payment Amount',
                  style: theme.textTheme.titleMedium,
                ),
                SizedBox(height: 8),
                Text(
                  '\$${widget.amount.toStringAsFixed(2)}',
                  style: theme.textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: theme.primaryColor,
                  ),
                ),
              ],
            ),
          ),

          // Error display
          if (_error != null)
            Container(
              width: double.infinity,
              margin: EdgeInsets.symmetric(horizontal: 16),
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.red.withAlpha(26),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.red.withAlpha(77)),
              ),
              child: Text(
                _error!,
                style: TextStyle(color: Colors.red),
              ),
            ),

          // Tab content
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildCardPaymentForm(),
                _buildInstapayForm(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCardPaymentForm() {
    return Padding(
      padding: EdgeInsets.all(16),
      child: Form(
        key: _cardFormKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Card Information',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            SizedBox(height: 16),
            
            TextFormField(
              controller: _cardNumberController,
              decoration: InputDecoration(
                labelText: 'Card Number',
                hintText: '1234 5678 9012 3456',
                prefixIcon: Icon(Icons.credit_card),
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter card number';
                }
                if (!PaymentService.isValidCardNumber(value)) {
                  return 'Please enter a valid card number';
                }
                return null;
              },
            ),
            SizedBox(height: 16),
            
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _expiryController,
                    decoration: InputDecoration(
                      labelText: 'Expiry Date',
                      hintText: 'MM/YY',
                      prefixIcon: Icon(Icons.calendar_today),
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter expiry date';
                      }
                      if (!PaymentService.isValidExpiryDate(value)) {
                        return 'Please enter a valid expiry date';
                      }
                      return null;
                    },
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: TextFormField(
                    controller: _cvvController,
                    decoration: InputDecoration(
                      labelText: 'CVV',
                      hintText: '123',
                      prefixIcon: Icon(Icons.security),
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.number,
                    obscureText: true,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter CVV';
                      }
                      if (!PaymentService.isValidCVV(value)) {
                        return 'Please enter a valid CVV';
                      }
                      return null;
                    },
                  ),
                ),
              ],
            ),

            SizedBox(height: 24),
            
            CustomButton(
              text: 'Pay with Card',
              onPressed: _isLoading ? null : _processCardPayment,
              isLoading: _isLoading,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInstapayForm() {
    return Padding(
      padding: EdgeInsets.all(16),
      child: Form(
        key: _instapayFormKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Instapay Information',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            SizedBox(height: 16),
            
            TextFormField(
              controller: _instapayController,
              decoration: InputDecoration(
                labelText: 'Instapay Number',
                hintText: '01112223334',
                prefixIcon: Icon(Icons.phone),
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.phone,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter Instapay number';
                }
                if (!PaymentService.isValidInstapayNumber(value)) {
                  return 'Please enter a valid Instapay number';
                }
                return null;
              },
            ),

            SizedBox(height: 24),
            
            CustomButton(
              text: 'Pay with Instapay',
              onPressed: _isLoading ? null : _processInstapayPayment,
              isLoading: _isLoading,
            ),
          ],
        ),
      ),
    );
  }
}
