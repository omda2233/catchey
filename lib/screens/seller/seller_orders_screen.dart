import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/order_service.dart';
import '../../models/order_model.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class SellerOrdersScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final orderService = OrderService();
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.orders),
      ),
      body: StreamBuilder<List<OrderModel>>(
        stream: orderService.streamSellerOrders(authProvider.currentUser!.uid),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Center(child: Text(l10n.errorLoadingOrders));
          }

          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }

          final orders = snapshot.data!;

          if (orders.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.shopping_bag_outlined,
                    size: 64,
                    color: theme.colorScheme.outline,
                  ),
                  SizedBox(height: 16),
                  Text(
                    l10n.noOrders,
                    style: theme.textTheme.titleLarge,
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
              return Card(
                margin: EdgeInsets.only(bottom: 16),
                child: ExpansionTile(
                  title: Text(
                    '${l10n.order} #${order.id.substring(0, 8)}',
                    style: theme.textTheme.titleMedium,
                  ),
                  subtitle: Text(
                    '${l10n.total}: \$${order.total.toStringAsFixed(2)}',
                    style: theme.textTheme.bodyMedium,
                  ),
                  trailing: _buildOrderStatusChip(context, order.status),
                  children: [
                    Padding(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Customer Info
                          Text(
                            l10n.customerInfo,
                            style: theme.textTheme.titleSmall,
                          ),
                          SizedBox(height: 8),
                          Text('${l10n.name}: ${order.customerName}'),
                          Text('${l10n.email}: ${order.customerEmail}'),
                          if (order.customerPhone != null)
                            Text('${l10n.phone}: ${order.customerPhone}'),
                          SizedBox(height: 16),

                          // Order Items
                          Text(
                            l10n.orderItems,
                            style: theme.textTheme.titleSmall,
                          ),
                          SizedBox(height: 8),
                          ...order.items.map((item) => Padding(
                                padding: EdgeInsets.only(bottom: 8),
                                child: Row(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: Image.network(
                                        item.image,
                                        width: 60,
                                        height: 60,
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                    SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            item.productName,
                                            style: theme.textTheme.bodyMedium,
                                          ),
                                          Text(
                                            '${l10n.quantity}: ${item.quantity}',
                                            style: theme.textTheme.bodySmall,
                                          ),
                                          Text(
                                            '\$${item.price.toStringAsFixed(2)}',
                                            style: theme.textTheme.bodyMedium
                                                ?.copyWith(
                                              color: theme.colorScheme.primary,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              )),
                          SizedBox(height: 16),

                          // Order Actions
                          if (order.status == OrderStatus.pending)
                            Row(
                              children: [
                                Expanded(
                                  child: OutlinedButton(
                                    onPressed: () async {
                                      try {
                                        await orderService.updateOrderStatus(
                                          order.id,
                                          OrderStatus.accepted,
                                        );
                                        ScaffoldMessenger.of(context)
                                            .showSnackBar(
                                          SnackBar(
                                            content: Text(l10n.orderAccepted),
                                          ),
                                        );
                                      } catch (e) {
                                        ScaffoldMessenger.of(context)
                                            .showSnackBar(
                                          SnackBar(
                                            content: Text(e.toString()),
                                          ),
                                        );
                                      }
                                    },
                                    child: Text(l10n.accept),
                                  ),
                                ),
                                SizedBox(width: 16),
                                Expanded(
                                  child: OutlinedButton(
                                    onPressed: () async {
                                      try {
                                        await orderService.updateOrderStatus(
                                          order.id,
                                          OrderStatus.rejected,
                                        );
                                        ScaffoldMessenger.of(context)
                                            .showSnackBar(
                                          SnackBar(
                                            content: Text(l10n.orderRejected),
                                          ),
                                        );
                                      } catch (e) {
                                        ScaffoldMessenger.of(context)
                                            .showSnackBar(
                                          SnackBar(
                                            content: Text(e.toString()),
                                          ),
                                        );
                                      }
                                    },
                                    style: OutlinedButton.styleFrom(
                                      foregroundColor: Colors.red,
                                    ),
                                    child: Text(l10n.reject),
                                  ),
                                ),
                              ],
                            ),
                          if (order.status == OrderStatus.accepted)
                            OutlinedButton(
                              onPressed: () async {
                                try {
                                  await orderService.updateOrderStatus(
                                    order.id,
                                    OrderStatus.shipped,
                                  );
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(l10n.orderShipped),
                                    ),
                                  );
                                } catch (e) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(e.toString()),
                                    ),
                                  );
                                }
                              },
                              child: Text(l10n.markAsShipped),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildOrderStatusChip(BuildContext context, OrderStatus status) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);

    Color color;
    String text;

    switch (status) {
      case OrderStatus.pending:
        color = Colors.orange;
        text = l10n.pending;
        break;
      case OrderStatus.accepted:
        color = Colors.blue;
        text = l10n.accepted;
        break;
      case OrderStatus.rejected:
        color = Colors.red;
        text = l10n.rejected;
        break;
      case OrderStatus.shipped:
        color = Colors.green;
        text = l10n.shipped;
        break;
      case OrderStatus.delivered:
        color = Colors.green;
        text = l10n.delivered;
        break;
      case OrderStatus.cancelled:
        color = Colors.red;
        text = l10n.cancelled;
        break;
    }

    return Chip(
      label: Text(
        text,
        style: TextStyle(color: Colors.white),
      ),
      backgroundColor: color,
    );
  }
} 