import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/order_service.dart';
import '../../models/order_model.dart';
import '../../widgets/custom_button.dart';

class DeliveryDashboard extends StatefulWidget {
  @override
  _DeliveryDashboardState createState() => _DeliveryDashboardState();
}

class _DeliveryDashboardState extends State<DeliveryDashboard>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final OrderService _orderService = OrderService();
  bool _isLoading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _updateDeliveryStatus(String orderId, OrderStatus newStatus) async {
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
            content: Text('Delivery status updated successfully'),
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
        title: Text('Delivery Dashboard'),
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(text: 'Assigned'),
            Tab(text: 'Delivered'),
          ],
        ),
      ),
      body: Column(
        children: [
          // Stats cards
          Container(
            height: 120,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: EdgeInsets.all(16),
              children: [
                _buildStatCard('Assigned', _getAssignedCount(authProvider.user!.uid), Colors.blue),
                SizedBox(width: 16),
                _buildStatCard('Delivered', _getDeliveredCount(authProvider.user!.uid), Colors.green),
              ],
            ),
          ),

          if (_error != null)
            Container(
              width: double.infinity,
              margin: EdgeInsets.symmetric(horizontal: 16),
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.red.withOpacity(0.3)),
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
                _buildOrdersList(authProvider.user!.uid, OrderStatus.shipped),
                _buildOrdersList(authProvider.user!.uid, OrderStatus.delivered),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String title, Stream<int> countStream, Color color) {
    return Container(
      width: 120,
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          StreamBuilder<int>(
            stream: countStream,
            builder: (context, snapshot) {
              final count = snapshot.data ?? 0;
              return Text(
                count.toString(),
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              );
            },
          ),
          SizedBox(height: 8),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              color: color,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrdersList(String deliveryId, OrderStatus status) {
    return StreamBuilder<List<OrderModel>>(
      stream: _orderService.getOrdersByStatus(deliveryId, status),
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
                  Icons.local_shipping,
                  size: 64,
                  color: Colors.grey,
                ),
                SizedBox(height: 16),
                Text(
                  'No delivery orders found',
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
                    color: _getStatusColor(order.status).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: _getStatusColor(order.status).withOpacity(0.3),
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

            // Delivery information
            Container(
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Delivery Information',
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text('Buyer ID: ${order.buyerId}'),
                  Text('Seller ID: ${order.sellerId}'),
                ],
              ),
            ),

            SizedBox(height: 16),

            // Action buttons
            _buildActionButtons(order),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButtons(OrderModel order) {
    switch (order.status) {
      case OrderStatus.shipped:
        return CustomButton(
          text: 'Mark as Delivered',
          onPressed: _isLoading ? null : () => _updateDeliveryStatus(order.id, OrderStatus.delivered),
          backgroundColor: Colors.green,
        );
      case OrderStatus.delivered:
        return Container(
          padding: EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.green.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.green.withOpacity(0.3)),
          ),
          child: Row(
            children: [
              Icon(Icons.check_circle, color: Colors.green),
              SizedBox(width: 8),
              Text(
                'Order Delivered',
                style: TextStyle(
                  color: Colors.green,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        );
      default:
        return SizedBox.shrink();
    }
  }

  Color _getStatusColor(OrderStatus status) {
    switch (status) {
      case OrderStatus.shipped:
        return Colors.blue;
      case OrderStatus.delivered:
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year} ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }

  Stream<int> _getAssignedCount(String deliveryId) {
    return _orderService
        .getOrdersByStatus(deliveryId, OrderStatus.shipped)
        .map((orders) => orders.length);
  }

  Stream<int> _getDeliveredCount(String deliveryId) {
    return _orderService
        .getOrdersByStatus(deliveryId, OrderStatus.delivered)
        .map((orders) => orders.length);
  }
}
