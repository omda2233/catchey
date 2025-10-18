import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/order_model.dart';
import '../../providers/auth_provider.dart';
import '../../services/order_service.dart';
import '../../widgets/custom_button.dart';

class SellerOrdersScreen extends StatefulWidget {
  @override
  _SellerOrdersScreenState createState() => _SellerOrdersScreenState();
}

class _SellerOrdersScreenState extends State<SellerOrdersScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final OrderService _orderService = OrderService();
  bool _isLoading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 6, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _updateOrderStatus(String orderId, OrderStatus newStatus) async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      await _orderService.updateOrderStatus(
        orderId: orderId,
        status: newStatus.toString().split('.').last,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Order status updated successfully'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Orders'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: [
            Tab(text: 'All'),
            Tab(text: 'Pending'),
            Tab(text: 'Processing'),
            Tab(text: 'Shipped'),
            Tab(text: 'Delivered'),
            Tab(text: 'Cancelled'),
          ],
        ),
      ),
      body: Column(
        children: [
          if (_error != null)
            Container(
              width: double.infinity,
              margin: EdgeInsets.all(16),
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.red.withAlpha(26), // 0.1 opacity equivalent
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.red.withAlpha(77)), // 0.3 opacity equivalent
              ),
              child: Text(
                _error!,
                style: TextStyle(color: Colors.red),
              ),
            ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildOrdersList(authProvider.user!.uid, null),
                _buildOrdersList(authProvider.user!.uid, OrderStatus.pending),
                _buildOrdersList(authProvider.user!.uid, OrderStatus.processing),
                _buildOrdersList(authProvider.user!.uid, OrderStatus.shipped),
                _buildOrdersList(authProvider.user!.uid, OrderStatus.delivered),
                _buildOrdersList(authProvider.user!.uid, OrderStatus.cancelled),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrdersList(String sellerId, OrderStatus? status) {
    return StreamBuilder<List<OrderModel>>(
      stream: status != null
          ? _orderService.getOrdersByStatus(sellerId, status)
          : _orderService.streamSellerOrders(sellerId),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        }

        if (snapshot.hasError) {
          return Center(
            child: Text('Error: ${snapshot.error}'),
          );
        }

        final orders = snapshot.data ?? [];

        if (orders.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.inbox,
                  size: 64,
                  color: Colors.grey,
                ),
                SizedBox(height: 16),
                Text(
                  'No orders found',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ],
            ),
          );
        }

        return ListView.builder(
          padding: EdgeInsets.all(16),
          itemCount: orders.length,
          itemBuilder: (context, index) {
            final order = orders[index];
            return _buildOrderCard(order);
          },
        );
      },
    );
  }

  Widget _buildOrderCard(OrderModel order) {
    final theme = Theme.of(context);

    return Card(
      margin: EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Order #${order.id.substring(0, 8)}',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getStatusColor(order.status).withAlpha(26), // 0.1 opacity equivalent
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: _getStatusColor(order.status).withAlpha(77), // 0.3 opacity equivalent
                    ),
                  ),
                  child: Text(
                    order.status.toString().split('.').last.toUpperCase(),
                    style: TextStyle(
                      color: _getStatusColor(order.status),
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              'Total: \$${order.totalAmount.toStringAsFixed(2)}',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: theme.primaryColor,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Items: ${order.items.length}',
              style: theme.textTheme.bodyMedium,
            ),
            SizedBox(height: 8),
            Text(
              'Date: ${_formatDate(order.createdAt)}',
              style: theme.textTheme.bodySmall,
            ),
            SizedBox(height: 16),

            // Order items
            ...order.items.map((item) => Padding(
                  padding: EdgeInsets.only(bottom: 4),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Product ID: ${item.productId}'),
                      Text('Qty: ${item.quantity} × \$${item.price.toStringAsFixed(2)}'),
                    ],
                  ),
                )),

            SizedBox(height: 16),

            // Action buttons based on status
            _buildActionButtons(order),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButtons(OrderModel order) {
    switch (order.status) {
      case OrderStatus.pending:
        return Row(
          children: [
            Expanded(
              child: CustomButton(
                text: 'Accept',
                onPressed: _isLoading ? null : () => _updateOrderStatus(order.id, OrderStatus.processing),
                backgroundColor: Colors.green,
              ),
            ),
            SizedBox(width: 8),
            Expanded(
              child: CustomButton(
                text: 'Reject',
                onPressed: _isLoading ? null : () => _updateOrderStatus(order.id, OrderStatus.cancelled),
                backgroundColor: Colors.red,
              ),
            ),
          ],
        );
      case OrderStatus.processing:
        return CustomButton(
          text: 'Mark as Shipped',
          onPressed: _isLoading ? null : () => _updateOrderStatus(order.id, OrderStatus.shipped),
          backgroundColor: Colors.blue,
        );
      case OrderStatus.shipped:
        return CustomButton(
          text: 'Mark as Delivered',
          onPressed: _isLoading ? null : () => _updateOrderStatus(order.id, OrderStatus.delivered),
          backgroundColor: Colors.green,
        );
      default:
        return SizedBox.shrink();
    }
  }

  Color _getStatusColor(OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return Colors.orange;
      case OrderStatus.processing:
        return Colors.blue;
      case OrderStatus.shipped:
        return Colors.purple;
      case OrderStatus.delivered:
        return Colors.green;
      case OrderStatus.cancelled:
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year} ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }
}
