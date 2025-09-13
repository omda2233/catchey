import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../widgets/custom_button.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import '../services/order_service.dart';
import '../providers/auth_provider.dart';

class CheckoutScreen extends StatefulWidget {
  @override
  _CheckoutScreenState createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  final _addressController = TextEditingController();
  final _cityController = TextEditingController();
  final _postalCodeController = TextEditingController();
  final _countryController = TextEditingController();
  final OrderService _orderService = OrderService();
  bool _isLoading = false;

  @override
  void dispose() {
    _addressController.dispose();
    _cityController.dispose();
    _postalCodeController.dispose();
    _countryController.dispose();
    super.dispose();
  }

  Future<void> _createOrder() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final authProvider = context.read<AuthProvider>();
      final cartProvider = context.read<CartProvider>();

      final result = await _orderService.processOrder(
        items: cartProvider.cart!.items.map((item) => item.toFirestore()).toList(),
        sellerId: cartProvider.cart!.items.first.product.sellerId,
        totalAmount: cartProvider.cart!.total,
      );

      if (result['success'] == true) {
        if (mounted) {
          Navigator.pushNamed(
            context,
            '/payment',
            arguments: {
              'amount': cartProvider.cart!.total,
              'orderId': result['orderId'],
              'sellerId': cartProvider.cart!.items.first.product.sellerId,
            },
          );
          cartProvider.clearCart(authProvider.user!.uid);
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(result['error'] ?? 'Failed to create order')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final cartProvider = Provider.of<CartProvider>(context);
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.checkout),
      ),
      body: ListView(
        padding: EdgeInsets.all(16),
        children: [
          // Order Summary
          Text(
            'Order Summary',
            style: theme.textTheme.headlineSmall,
          ),
          SizedBox(height: 16),
          ...(cartProvider.cart?.items ?? []).map((item) => ListTile(
                leading: CircleAvatar(
                  backgroundImage: NetworkImage(item.product.images.first),
                ),
                title: Text(item.product.name),
                subtitle: Text('Qty: ${item.quantity}'),
                trailing: Text('\$${item.total.toStringAsFixed(2)}'),
              )),
          Divider(height: 32),

          // Shipping Address
          Text(
            'Shipping Address',
            style: theme.textTheme.headlineSmall,
          ),
          SizedBox(height: 16),
          Form(
            key: _formKey,
            child: Column(
              children: [
                TextFormField(
                  controller: _addressController,
                  decoration: InputDecoration(labelText: 'Address'),
                  validator: (value) =>
                      value!.isEmpty ? 'Please enter your address' : null,
                ),
                SizedBox(height: 16),
                TextFormField(
                  controller: _cityController,
                  decoration: InputDecoration(labelText: 'City'),
                  validator: (value) =>
                      value!.isEmpty ? 'Please enter your city' : null,
                ),
                SizedBox(height: 16),
                TextFormField(
                  controller: _postalCodeController,
                  decoration: InputDecoration(labelText: 'Postal Code'),
                  validator: (value) =>
                      value!.isEmpty ? 'Please enter your postal code' : null,
                ),
                SizedBox(height: 16),
                TextFormField(
                  controller: _countryController,
                  decoration: InputDecoration(labelText: 'Country'),
                  validator: (value) =>
                      value!.isEmpty ? 'Please enter your country' : null,
                ),
              ],
            ),
          ),
          SizedBox(height: 32),

          // Payment Button
          CustomButton(
            text: 'Proceed to Payment',
            onPressed: _isLoading ? null : _createOrder,
            isLoading: _isLoading,
          ),
        ],
      ),
    );
  }
}
