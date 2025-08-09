import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/product_service.dart';
import '../../models/product.dart';
import '../../widgets/product_card.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class SellerDashboard extends StatefulWidget {
  @override
  _SellerDashboardState createState() => _SellerDashboardState();
}

class _SellerDashboardState extends State<SellerDashboard> {
  final ProductService _productService = ProductService();
  
  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.sellerDashboard),
        actions: [
          IconButton(
            icon: Icon(Icons.add),
            onPressed: () => Navigator.pushNamed(context, '/add_product'),
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          children: [
            UserAccountsDrawerHeader(
              accountName: Text(authProvider.currentUser?.displayName ?? ''),
              accountEmail: Text(authProvider.currentUser?.email ?? ''),
              currentAccountPicture: CircleAvatar(
                child: Text(
                  authProvider.currentUser?.displayName?[0].toUpperCase() ?? 'S',
                ),
              ),
            ),
            ListTile(
              leading: Icon(Icons.inventory),
              title: Text(l10n.products),
              onTap: () => Navigator.pop(context),
            ),
            ListTile(
              leading: Icon(Icons.shopping_bag),
              title: Text(l10n.orders),
              onTap: () => Navigator.pushNamed(context, '/seller_orders'),
            ),
            ListTile(
              leading: Icon(Icons.analytics),
              title: Text(l10n.analytics),
              onTap: () => Navigator.pushNamed(context, '/seller_analytics'),
            ),
            ListTile(
              leading: Icon(Icons.settings),
              title: Text(l10n.settings),
              onTap: () => Navigator.pushNamed(context, '/seller_settings'),
            ),
            ListTile(
              leading: Icon(Icons.exit_to_app),
              title: Text(l10n.logout),
              onTap: () async {
                await authProvider.logout();
                Navigator.pushReplacementNamed(context, '/login');
              },
            ),
          ],
        ),
      ),
      body: StreamBuilder<List<Product>>(
        stream: _productService.streamSellerProducts(authProvider.currentUser!.uid),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Center(child: Text(l10n.errorLoadingProducts));
          }
          
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }
          
          final products = snapshot.data!;
          
          if (products.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.inventory_2_outlined,
                    size: 64,
                    color: Theme.of(context).colorScheme.outline,
                  ),
                  SizedBox(height: 16),
                  Text(
                    l10n.noProducts,
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  SizedBox(height: 8),
                  ElevatedButton.icon(
                    onPressed: () => Navigator.pushNamed(context, '/add_product'),
                    icon: Icon(Icons.add),
                    label: Text(l10n.addProduct),
                  ),
                ],
              ),
            );
          }
          
          return GridView.builder(
            padding: EdgeInsets.all(16),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.75,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
            ),
            itemCount: products.length,
            itemBuilder: (context, index) {
              final product = products[index];
              return ProductCard(
                product: product,
                onTap: () => Navigator.pushNamed(
                  context,
                  '/edit_product',
                  arguments: product,
                ),
                trailing: PopupMenuButton(
                  itemBuilder: (context) => [
                    PopupMenuItem(
                      child: Text(l10n.edit),
                      onTap: () => Navigator.pushNamed(
                        context,
                        '/edit_product',
                        arguments: product,
                      ),
                    ),
                    PopupMenuItem(
                      child: Text(l10n.delete),
                      onTap: () async {
                        final confirmed = await showDialog<bool>(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: Text(l10n.deleteProduct),
                            content: Text(l10n.deleteProductConfirmation),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context, false),
                                child: Text(l10n.cancel),
                              ),
                              TextButton(
                                onPressed: () => Navigator.pop(context, true),
                                child: Text(
                                  l10n.delete,
                                  style: TextStyle(color: Colors.red),
                                ),
                              ),
                            ],
                          ),
                        );
                        
                        if (confirmed == true) {
                          await _productService.deleteProduct(product.id);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(l10n.productDeleted)),
                          );
                        }
                      },
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pushNamed(context, '/add_product'),
        child: Icon(Icons.add),
        tooltip: l10n.addProduct,
      ),
    );
  }
} 